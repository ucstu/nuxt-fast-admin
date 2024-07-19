import type { NuxtApp } from "#app";
import { shallowRef, useNuxtApp } from "#imports";
import type { RouteLocationRaw } from "#vue-router";

export function toEqual(
  a?: RouteLocationRaw,
  b?: RouteLocationRaw,
  nuxtApp: NuxtApp = useNuxtApp(),
): boolean {
  const result = shallowRef(false);
  if (!a || !b) return result.value;

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-utils:to-equal",
    a,
    b,
    result,
  );

  return result.value;
}

export function isNuxtApp(value: unknown): value is NuxtApp {
  return (
    value instanceof Object &&
    "versions" in value &&
    value.versions instanceof Object &&
    "nuxt" in value.versions
  );
}
