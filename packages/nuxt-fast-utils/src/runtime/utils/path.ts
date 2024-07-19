import type { RouteLocationRaw } from "#vue-router";

export function fixTo(to: RouteLocationRaw) {
  if (typeof to === "string") return to;
  if ("path" in to && "name" in to) {
    return {
      ...to,
      name: undefined,
    };
  }
  return to;
}

export function getToPath(to: RouteLocationRaw | undefined) {
  if (!to) return;
  return typeof to === "string" ? to : to.path;
}
