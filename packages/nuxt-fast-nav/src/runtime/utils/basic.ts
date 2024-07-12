import { shallowRef, useNuxtApp } from "#imports";
import type { RouteLocationRaw } from "#vue-router";

export function toEqual(
  a?: RouteLocationRaw,
  b?: RouteLocationRaw,
  nuxtApp = useNuxtApp(),
): boolean {
  const result = shallowRef(false);
  if (!a || !b) return result.value;

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:to-equal",
    a,
    b,
    result,
  );

  return result.value;
}
