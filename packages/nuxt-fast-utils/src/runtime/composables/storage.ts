import { cookieStorage, customRef, useRuntimeConfig, watch } from "#imports";
import {
  useStorage as _useStorage,
  toRef,
  type MaybeRefOrGetter,
  type RemovableRef,
  type StorageLike,
  type UseStorageOptions,
} from "@vueuse/core";

export function useStorage(
  key: string,
  defaults: MaybeRefOrGetter<string>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<string>,
): RemovableRef<string>;
export function useStorage(
  key: string,
  defaults: MaybeRefOrGetter<boolean>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>;
export function useStorage(
  key: string,
  defaults: MaybeRefOrGetter<number>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<number>,
): RemovableRef<number>;
export function useStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;
export function useStorage<T = unknown>(
  key: string,
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  defaults: MaybeRefOrGetter<null>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;
export function useStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options: UseStorageOptions<T> = {},
): RemovableRef<T> {
  const storageRef = toRef(storage);
  if (!storageRef.value) {
    const config = useRuntimeConfig().public.fastUtils;
    storageRef.value = config.ssr ? cookieStorage : localStorage;
  }
  return customRef((track, trigger) => {
    let storageValue = _useStorage(key, defaults, storageRef.value, options);
    watch(storageRef, (newStorage) => {
      const old = storageValue.value;
      storageValue.value = null;
      storageValue = _useStorage(key, defaults, newStorage, options);
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
