import type { NuxtApp } from "#app";
import { $useRouter, toRaw, useNuxtApp } from "#imports";
import type { RouteLocationRaw, RouteLocationResolved } from "#vue-router";

export function resolveTo(to: undefined, nuxtApp?: NuxtApp): undefined;
export function resolveTo(
  to: RouteLocationRaw,
  nuxtApp?: NuxtApp
): RouteLocationResolved;
export function resolveTo(
  to: RouteLocationRaw | undefined,
  nuxtApp: NuxtApp = useNuxtApp()
) {
  if (!to) return;
  try {
    return toRaw($useRouter(nuxtApp)).resolve(to);
  } catch {
    console.error("[fast-utils] 不能解析路由", to);
    return;
  }
}

export function getToPath(
  to: RouteLocationRaw | undefined,
  nuxtApp: NuxtApp = useNuxtApp()
) {
  if (!to) return;
  return resolveTo(to, nuxtApp).fullPath ?? "";
}
