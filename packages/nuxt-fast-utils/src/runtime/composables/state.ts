import {
  cookieStorage,
  customRef,
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

/**
 * Keep states in the global scope to be reusable across Nuxt instances.
 *
 * @see https://vueuse.org/createGlobalState
 * @param stateFactory A factory function to create the state
 */
export function createNuxtGlobalState<Fn extends AnyFn>(
  stateFactory: Fn,
  name: string = nanoid(),
): Fn {
  return ((...args: any[]) => {
    const nuxtApp = useNuxtApp();
    if (!nuxtApp[`$${name}`]) {
      const result = stateFactory(...args);
      nuxtApp.provide(name, result);
      return result;
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
  name: string = nanoid(),
): Fn {
  let subscribers = 0;

  const dispose = () => {
    const nuxtApp = useNuxtApp();
    subscribers -= 1;
    if (subscribers <= 0) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete nuxtApp[`$${name}`];
    }
  };

  return <Fn>((...args) => {
    const nuxtApp = useNuxtApp();
    subscribers += 1;
    if (!nuxtApp[`$${name}`]) {
      nuxtApp.provide(name, composable(...args));
    }
    tryOnScopeDispose(dispose);
    return nuxtApp[`$${name}`];
  });
}

export function useNuxtStorage(
  key: string,
  defaults: MaybeRefOrGetter<string>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<string>,
): RemovableRef<string>;
export function useNuxtStorage(
  key: string,
  defaults: MaybeRefOrGetter<boolean>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>;
export function useNuxtStorage(
  key: string,
  defaults: MaybeRefOrGetter<number>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<number>,
): RemovableRef<number>;
export function useNuxtStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;
export function useNuxtStorage<T = unknown>(
  key: string,
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  defaults: MaybeRefOrGetter<null>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<T>,
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
  options: UseStorageOptions<T> = {},
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
