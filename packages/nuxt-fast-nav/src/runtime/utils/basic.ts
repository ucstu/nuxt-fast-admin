import { shallowRef, useNuxtApp } from "#imports";
import type { FastNavExtra } from "../types";

export function toEqual(
  a: FastNavExtra["to"],
  b: FastNavExtra["to"],
  nuxtApp = useNuxtApp()
): boolean {
  const result = shallowRef(false);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:to-equal",
    a,
    b,
    result
  );
  return result.value;
}
