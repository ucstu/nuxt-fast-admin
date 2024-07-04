import {
  computed,
  shallowReadonly,
  shallowRef,
  watchEffect,
  type Ref,
} from "#imports";
import { get, set } from "lodash-es";
import type { Get, LiteralUnion, Paths } from "type-fest";
import type { WatchOptionsBase, WritableComputedRef } from "vue";

export type ToRefDeep<
  T extends object,
  K extends LiteralUnion<Paths<T>, string>,
  V extends Get<T, `${K}`> = Get<T, `${K}`>
> = WritableComputedRef<V>;
export function toRefDeep<
  T extends object = object,
  K extends LiteralUnion<Paths<T>, string> = LiteralUnion<Paths<T>, string>
>(object: T, key: K): ToRefDeep<T, K>;
export function toRefDeep<
  T extends object = object,
  K extends LiteralUnion<Paths<T>, string> = LiteralUnion<Paths<T>, string>
>(object: T, key: K) {
  return computed({
    get() {
      return get(object, key);
    },
    set(value) {
      set(object, key, value);
    },
  });
}

export function computedEager<T>(
  fn: () => T,
  options?: WatchOptionsBase
): Readonly<Ref<T>> {
  const result = shallowRef();

  watchEffect(
    () => {
      result.value = fn();
    },
    {
      ...options,
      flush: options?.flush ?? "sync",
    }
  );

  return shallowReadonly(result);
}
