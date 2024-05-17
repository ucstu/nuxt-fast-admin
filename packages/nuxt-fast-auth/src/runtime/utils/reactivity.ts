import {
  computed,
  ref,
  toValue,
  useCookie,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from "#imports";
import cookie from "js-cookie";
import { deserialize, serialize } from "./convert";

/**
 * 将可能是 Ref 的值转换为 Ref
 * @param value 可能是 Ref 的值
 * @returns Ref
 */
export function toRef<T>(value: MaybeRefOrGetter<T>) {
  return computed(() => toValue(value));
}

/**
 * 使用 Storage 选项
 */
interface StorageOptions<T> {
  /**
   * 存储位置
   */
  storage?: MaybeRefOrGetter<"localStorage" | "sessionStorage">;
  /**
   * 默认值
   */
  defaultValue?: () => T;
}
/**
 * 使用 Storage
 * @param key 键
 * @param options 选项
 * @returns 值
 */
export function useStorageSync<T>(
  key: string,
  options: StorageOptions<T> = {},
): Ref<T | undefined | null> {
  const { storage = "sessionStorage", defaultValue } = options;

  const storageRef = toRef(storage);
  const _value = ref(defaultValue?.()) as Ref<T | undefined | null>;
  if (import.meta.server) return _value;

  watch(
    storageRef,
    () => {
      const _default = defaultValue?.();
      const raw = window[storageRef.value].getItem(key);
      _value.value = raw ? deserialize(raw) : _default;
      if (!raw) {
        window[storageRef.value].setItem(key, serialize(_default));
      }
    },
    { immediate: true },
  );
  const value = computed({
    get() {
      return toValue(_value);
    },
    set(newValue) {
      if (newValue === undefined) {
        window[storageRef.value].removeItem(key);
      } else {
        window[storageRef.value].setItem(key, serialize(newValue));
      }
      _value.value = newValue;
    },
  });
  return value;
}

/**
 * 使用 Cookie 选项
 */
interface CookieOptions<T> {
  /**
   * 默认值
   */
  defaultValue?: () => T;
  /**
   * cookie 选项
   */
  cookieOptions?: MaybeRefOrGetter<Cookies.CookieAttributes>;
}
/**
 * 使用 Cookie
 * @param key 键
 * @param options 选项
 * @returns 值
 */
export function useCookieSync<T>(
  key: string,
  options: CookieOptions<T> = {},
): Ref<T | undefined | null> {
  const { cookieOptions, defaultValue } = options;

  const optionsRef = toRef(cookieOptions);
  const _value = useCookie<T | undefined | null>(key, {
    default: defaultValue,
    ...(optionsRef.value as CookieOptions<T | null | undefined>),
  });
  if (import.meta.server) return _value;

  watch(optionsRef, (options) => {
    if (_value.value) {
      cookie.set(key, serialize(_value.value), options);
    }
  });
  const value = computed({
    get() {
      return _value.value;
    },
    set(value) {
      _value.value = value;
      cookie.set(key, serialize(value), optionsRef.value);
    },
  });
  return value;
}
