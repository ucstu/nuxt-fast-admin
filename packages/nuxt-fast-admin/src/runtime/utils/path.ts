import type { RouteLocationRaw } from "#vue-router";

export function getToPath(to: RouteLocationRaw | undefined) {
  if (!to) return "";
  return typeof to === "string" ? to : to.path;
}
