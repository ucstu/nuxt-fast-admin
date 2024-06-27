import { cookieStorage, customRef, watch } from "#imports";
import {
  toRef,
  useStorage,
  type MaybeRefOrGetter,
  type RemovableRef,
  type StorageLike,
  type UseStorageOptions,
} from "@vueuse/core";

export function useFuStorage(
  key: string,
  defaults: MaybeRefOrGetter<string>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<string>
): RemovableRef<string>;
export function useFuStorage(
  key: string,
  defaults: MaybeRefOrGetter<boolean>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<boolean>
): RemovableRef<boolean>;
export function useFuStorage(
  key: string,
  defaults: MaybeRefOrGetter<number>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<number>
): RemovableRef<number>;
export function useFuStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<T>
): RemovableRef<T>;
export function useFuStorage<T = unknown>(
  key: string,
  defaults: MaybeRefOrGetter<null>,
  storage?: MaybeRefOrGetter<StorageLike>,
  options?: UseStorageOptions<T>
): RemovableRef<T>;
export function useFuStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage: MaybeRefOrGetter<StorageLike> | undefined,
  options: UseStorageOptions<T> = {}
): RemovableRef<T> {
  const storageRef = toRef(storage);
  if (!storageRef.value) {
    storageRef.value = cookieStorage;
  }
  return customRef((track, trigger) => {
    let storageValue = useStorage(key, defaults, storageRef.value, options);
    watch(storageRef, (newStorage) => {
      storageValue = useStorage(key, defaults, newStorage, options);
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
