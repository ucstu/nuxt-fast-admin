import {
  nextTick,
  onMounted,
  ref,
  shallowRef,
  useCookie,
  useRuntimeConfig,
  watch,
} from "#imports";
import {
  StorageSerializers,
  customStorageEventName,
  defaultWindow,
  getSSRHandler,
  pausableWatch,
  toRef,
  toValue,
  useEventListener,
  type MaybeRefOrGetter,
  type RemovableRef,
  type StorageEventLike,
  type StorageLike,
  type UseStorageOptions,
} from "@vueuse/core";
import { CookieStorage } from "cookie-storage";
import { cookieStorage, guessSerializerType } from "../utils";

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
export function useFuStorage<
  T extends string | number | boolean | object | null
>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage: MaybeRefOrGetter<StorageLike> | undefined,
  options: UseStorageOptions<T> = {}
): RemovableRef<T> {
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    },
    initOnMounted,
  } = options;
  const runtimeConfig = useRuntimeConfig().public.fastUtils;
  const _storage = toRef(() => {
    let _storage = toValue(storage);
    if (_storage) return _storage;
    if (runtimeConfig.ssr) return cookieStorage;
    try {
      _storage = getSSRHandler(
        "getDefaultStorage",
        () => defaultWindow?.localStorage
      )();
    } catch (e) {
      onError(e);
    }
    return _storage;
  });

  const data = (shallow ? shallowRef : ref)(
    typeof defaults === "function" ? defaults() : defaults
  ) as RemovableRef<T>;

  if (!_storage.value) return data;
  if (runtimeConfig.ssr && _storage.value instanceof CookieStorage) {
    return useCookie(key, {
      default() {
        return toValue(defaults);
      },
    });
  }

  console.log(_storage.value);

  const rawInit: T = toValue(defaults);
  const type = guessSerializerType<T>(rawInit);
  const serializer = options.serializer ?? StorageSerializers[type];

  const { pause: pauseWatch, resume: resumeWatch } = pausableWatch(
    data,
    () => write(data.value),
    { flush, deep, eventFilter }
  );

  if (window && listenToStorageChanges) {
    useEventListener(window, "storage", update);
    useEventListener(window, customStorageEventName, updateFromCustomEvent);
    if (initOnMounted) {
      onMounted(() => {
        update();
      });
    }
  }

  // avoid reading immediately to avoid hydration mismatch when doing SSR
  if (!initOnMounted) update();

  watch(_storage, () => update());

  function dispatchWriteEvent(
    oldValue: string | null,
    newValue: string | null
  ) {
    // send custom event to communicate within same page
    // importantly this should _not_ be a StorageEvent since those cannot
    // be constructed with a non-built-in storage area
    if (window) {
      window.dispatchEvent(
        new CustomEvent<StorageEventLike>(customStorageEventName, {
          detail: {
            key,
            oldValue,
            newValue,
            storageArea: _storage.value!,
          },
        })
      );
    }
  }

  function write(v: unknown) {
    try {
      const oldValue = _storage.value!.getItem(key);

      if (v == null) {
        dispatchWriteEvent(oldValue, null);
        _storage.value!.removeItem(key);
      } else {
        const serialized = serializer.write(v as any);
        if (oldValue !== serialized) {
          _storage.value!.setItem(key, serialized);
          dispatchWriteEvent(oldValue, serialized);
        }
      }
    } catch (e) {
      onError(e);
    }
  }

  function read(event?: StorageEventLike) {
    const rawValue = event ? event.newValue : _storage.value!.getItem(key);

    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        _storage.value!.setItem(key, serializer.write(rawInit));
      return rawInit;
    } else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue);
      if (typeof mergeDefaults === "function")
        return mergeDefaults(value, rawInit);
      else if (type === "object" && !Array.isArray(value))
        return { ...(rawInit as any), ...value };
      return value;
    } else if (typeof rawValue !== "string") {
      return rawValue;
    } else {
      return serializer.read(rawValue);
    }
  }

  function update(event?: StorageEventLike) {
    if (event && event.storageArea !== _storage.value) return;

    if (event && event.key == null) {
      data.value = rawInit;
      return;
    }

    if (event && event.key !== key) return;

    pauseWatch();
    try {
      if (event?.newValue !== serializer.write(data.value))
        data.value = read(event);
    } catch (e) {
      onError(e);
    } finally {
      // use nextTick to avoid infinite loop
      if (event) nextTick(resumeWatch);
      else resumeWatch();
    }
  }

  function updateFromCustomEvent(event: CustomEvent<StorageEventLike>) {
    update(event.detail);
  }

  return data;
}
