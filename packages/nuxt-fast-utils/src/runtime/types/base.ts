import type { RouteMeta } from "#vue-router";

export interface RouteMetas<T extends RouteMeta = RouteMeta> {
  [path: string]: T;
}
