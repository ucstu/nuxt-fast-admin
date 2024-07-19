import type { NuxtApp } from "#app";
import { $useRouter, toRaw, useNuxtApp } from "#imports";
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
  RouteLocationNormalizedGeneric,
  RouteLocationRaw,
} from "#vue-router";
import queryString from "query-string";

export function resolveTo(to: undefined, nuxtApp?: NuxtApp): undefined;
export function resolveTo(
  to: RouteLocationRaw,
  nuxtApp?: NuxtApp,
): RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
export function resolveTo(
  to: RouteLocationRaw | undefined,
  nuxtApp: NuxtApp = useNuxtApp(),
): RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric | undefined {
  if (!to) return;
  if (typeof to === "string") {
    const resut = queryString.parseUrl(to, {
      parseFragmentIdentifier: true,
    });
    return {
      path: resut.url,
      query: resut.query,
      hash: resut.fragmentIdentifier,
    };
  }
  if (to.path) return to;
  if ("name" in to) {
    return toRaw($useRouter(nuxtApp)).resolve(to);
  }
  return to;
}

export function getToPath(
  to: RouteLocationRaw | undefined,
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  if (!to) return;
  if (typeof to === "string") return to;
  if ((to as RouteLocationNormalizedGeneric).fullPath)
    return (to as RouteLocationNormalizedGeneric).fullPath;
  const resolved = resolveTo(to, nuxtApp);
  if (!resolved.path) return to.path;
  return (
    queryString.stringifyUrl({
      url: resolved.path,
      query: resolved.query,
    }) + (resolved.hash ? resolved.hash : "")
  );
}
