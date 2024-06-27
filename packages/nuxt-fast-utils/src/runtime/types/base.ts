import type {
  RouteLocationNormalized,
  RouteLocationRaw,
  RouteRecordNormalized,
} from "#vue-router";

export type RouteRecordOrLocation =
  | RouteRecordNormalized
  | RouteLocationNormalized
  | RouteLocationRaw;

export interface FsUtilsRouteMeta {}
