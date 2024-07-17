import type { NuxtApp } from "#app";
import { shallowRef, useNuxtApp } from "#imports";
import type { RouteLocationRaw } from "#vue-router";
import type {
  FastNavMenu,
  FastNavMenuFilled,
  FastNavPage,
  FastNavPageFilled,
} from "../types";

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
    "fast-nav:to-equal",
    a,
    b,
    result,
  );

  return result.value;
}

export function isNavMenu(
  value: FastNavMenu | FastNavPage | undefined,
): value is FastNavMenu {
  return value !== undefined && "name" in value;
}

export function isNavPage(
  value: FastNavMenu | FastNavPage | undefined,
): value is FastNavPage {
  return value !== undefined && !("name" in value);
}

export function isNavMenuFilled(
  value: FastNavMenuFilled | FastNavPageFilled | undefined,
): value is FastNavMenuFilled {
  return value !== undefined && "name" in value;
}

export function isNavPageFilled(
  value: FastNavMenuFilled | FastNavPageFilled | undefined,
): value is FastNavPageFilled {
  return value !== undefined && !("name" in value);
}

export function getToPath(to: RouteLocationRaw) {
  return typeof to === "string" ? to : to.path;
}
