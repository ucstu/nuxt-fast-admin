import type { NuxtApp } from "#app";
import {
  computed,
  cookieStorage,
  customRef,
  unref,
  useNuxtApp,
  watch,
} from "#imports";
import {
  computedEager,
  toValue,
  tryOnScopeDispose,
  useStorage,
  type AnyFn,
  type MaybeRefOrGetter,
  type Reactified,
  type ReactifyOptions,
  type RemovableRef,
  type StorageLike,
  type UseStorageOptions,
} from "@vueuse/core";
import { get, set } from "lodash-es";
import { nanoid } from "nanoid";
import type { Get, Paths } from "type-fest";
import type { WritableComputedRef } from "vue-demi";
import { configKey } from "../config";
import { H3CookieStorage, nuxtApp } from "../utils";
import { $useRuntimeConfig } from "./nuxt";

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
  return ((...args: unknown[]) => {
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

interface UseNuxtStorageOptions<T> extends UseStorageOptions<T> {
  nuxtApp?: NuxtApp;
}
export function useNuxtStorage(
  key: string,
  defaults: MaybeRefOrGetter<string>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseNuxtStorageOptions<string>,
): RemovableRef<string>;
export function useNuxtStorage(
  key: string,
  defaults: MaybeRefOrGetter<boolean>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseNuxtStorageOptions<boolean>,
): RemovableRef<boolean>;
export function useNuxtStorage(
  key: string,
  defaults: MaybeRefOrGetter<number>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseNuxtStorageOptions<number>,
): RemovableRef<number>;
export function useNuxtStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseNuxtStorageOptions<T>,
): RemovableRef<T>;
export function useNuxtStorage<T = unknown>(
  key: string,
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  defaults: MaybeRefOrGetter<null>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseNuxtStorageOptions<T>,
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
  options: UseNuxtStorageOptions<T> = {},
) {
  options.nuxtApp ??= useNuxtApp();
  const runtimeConfig = $useRuntimeConfig(options.nuxtApp).public[configKey];
  const storageRef = computedEager(() =>
    toValue(storage)
      ? toValue(storage)
      : runtimeConfig.ssr
        ? cookieStorage
        : localStorage,
  );

  if (storageRef.value instanceof H3CookieStorage) {
    nuxtApp.value ??= options.nuxtApp;
  }

  return customRef((track, trigger) => {
    let storageValue = useStorage<T>(key, defaults, storageRef.value, options);
    watch(storageRef, (newStorage) => {
      if (newStorage instanceof H3CookieStorage) {
        nuxtApp.value ??= options.nuxtApp;
      }

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

export function toRefDeep<
  T extends object,
  K extends Paths<T> & string,
  V extends Get<T, K>,
>(obj: T, key: K): WritableComputedRef<V> {
  return computed<V>({
    get() {
      return get(obj, key) as V;
    },
    set(value) {
      set(obj, key, value);
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function reactifyEager<T extends Function, K extends boolean = true>(
  fn: T,
  options?: ReactifyOptions<K>,
): Reactified<T, K> {
  const unrefFn = options?.computedGetter === false ? unref : toValue;
  return function (this: unknown, ...args: unknown[]) {
    return computedEager(() =>
      fn.apply(
        this,
        args.map((i) => unrefFn(i)),
      ),
    );
  } as Reactified<T, K>;
}
