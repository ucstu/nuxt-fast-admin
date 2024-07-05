import {
  computed,
  shallowReadonly,
  shallowRef,
  watchEffect,
  type Ref,
} from "#imports";
import { get, set } from "lodash-es";
import type { LiteralUnion, Paths } from "type-fest";
import type { WatchOptionsBase } from "vue";
import type { ToRefDeep } from "../types";

export function toRefDeep<
  T extends object,
  K extends LiteralUnion<Paths<T>, string>
>(object: T, key: K): ToRefDeep<T, K>;
export function toRefDeep<
  T extends object,
  K extends LiteralUnion<Paths<T>, string>
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

export function computedEagerShallow<T>(
  fn: () => T,
  options?: WatchOptionsBase
): Readonly<Ref<T>> {
  const result = shallowRef();

  watchEffect(() => (result.value = fn()), {
    ...options,
    flush: options?.flush ?? "sync",
  });

  return shallowReadonly(result);
}
