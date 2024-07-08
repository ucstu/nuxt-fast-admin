// ported from https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j
// by @linusborg https://github.com/LinusBorg

import { shallowReadonly, shallowRef, watchEffect } from "#imports";
import type { WatchOptionsBase } from "vue-demi";

/**
 * Note: If you are using Vue 3.4+, you can straight use computed instead.
 * Because in Vue 3.4+, if computed new value does not change,
 * computed, effect, watch, watchEffect, render dependencies will not be triggered.
 * refer: https://github.com/vuejs/core/pull/5912
 *
 * @param fn effect function
 * @param options WatchOptionsBase
 * @returns readonly ref
 */
export function computedEager<T>(fn: () => T, options?: WatchOptionsBase) {
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

// alias
export { computedEager as eagerComputed };
