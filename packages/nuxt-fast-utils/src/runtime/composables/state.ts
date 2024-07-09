import {
  cookieStorage,
  customRef,
  effectScope,
  tryUseNuxtApp,
  useNuxtApp,
  useRuntimeConfig,
  watch,
} from "#imports";
import {
  toRef,
  tryOnScopeDispose,
  useStorage,
  type AnyFn,
  type MaybeRefOrGetter,
  type RemovableRef,
  type StorageLike,
  type UseStorageOptions,
} from "@vueuse/core";
import { nanoid } from "nanoid";
import type { EffectScope } from "vue-demi";

/**
 * Keep states in the global scope to be reusable across Nuxt instances.
 *
 * @see https://vueuse.org/createGlobalState
 * @param stateFactory A factory function to create the state
 */
export function createNuxtGlobalState<Fn extends AnyFn>(
  stateFactory: Fn,
  name: string = nanoid()
): Fn {
  let initialized = false;
  let nuxtApp = tryUseNuxtApp();
  const scope = effectScope(true);

  return ((...args: any[]) => {
    nuxtApp ??= useNuxtApp();
    if (!initialized) {
      nuxtApp.provide(name, scope.run(() => stateFactory(...args))!);
      initialized = true;
    }
    return nuxtApp[`$${name}`];
  }) as Fn;
}

/**
 * Make a composable function usable with multiple vue instances.
 *
 * @see https://vueuse.org/createSharedComposable
 */
export function createNuxtSharedComposable<Fn extends AnyFn>(
  composable: Fn,
  name: string = nanoid()
): Fn {
  let subscribers = 0;
  let nuxtApp = tryUseNuxtApp();
  let scope: EffectScope | undefined;

  const dispose = () => {
    nuxtApp ??= useNuxtApp();
    subscribers -= 1;
    if (scope && subscribers <= 0) {
      scope.stop();
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete nuxtApp[`$${name}`];
      scope = undefined;
    }
  };

  return <Fn>((...args) => {
    nuxtApp ??= useNuxtApp();
    subscribers += 1;
    if (!nuxtApp[`$${name}`]) {
      scope = effectScope(true);
      nuxtApp.provide(
        name,
        scope.run(() => composable(...args))
      );
    }
    tryOnScopeDispose(dispose);
    return nuxtApp[`$${name}`];
  });
}

export function useNuxtStorage(
  key: string,
  defaults: MaybeRefOrGetter<string>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<string>
): RemovableRef<string>;
export function useNuxtStorage(
  key: string,
  defaults: MaybeRefOrGetter<boolean>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<boolean>
): RemovableRef<boolean>;
export function useNuxtStorage(
  key: string,
  defaults: MaybeRefOrGetter<number>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<number>
): RemovableRef<number>;
export function useNuxtStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<T>
): RemovableRef<T>;
export function useNuxtStorage<T = unknown>(
  key: string,
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  defaults: MaybeRefOrGetter<null>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<T>
): RemovableRef<T>;

/**
 * Reactive LocalStorage/SessionStorage.
 *
 * @see https://vueuse.org/useStorage
 */
export function useNuxtStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options: UseStorageOptions<T> = {}
) {
  const storageRef = toRef(storage);
  if (!storageRef.value) {
    const config = useRuntimeConfig().public.fastUtils;
    storageRef.value = config.ssr ? cookieStorage : localStorage;
  }
  return customRef((track, trigger) => {
    let storageValue = useStorage(key, defaults, storageRef.value, options);
    watch(storageRef, (newStorage) => {
      const old = storageValue.value;
      storageValue.value = null;
      storageValue = useStorage(key, defaults, newStorage, options);
      storageValue.value = old;
      trigger();
    });
    return {
      get() {
        track();
        return storageValue.value;
      },
      set(value: T) {
        storageValue.value = value;
        trigger();
      },
    };
  });
}
