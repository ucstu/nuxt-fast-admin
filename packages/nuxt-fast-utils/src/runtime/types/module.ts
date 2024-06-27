import type { RouteMeta, RouteRecordNormalized } from "#vue-router";
import type { RequiredDeep } from "type-fest";

export interface ModuleOptions {}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastUtils: ModuleOptionsDefaults & {
    /**
     * 服务端渲染
     */
    ssr: boolean;
  };
}

export interface ModuleRuntimeHooks {
  "fast-utils:route-meta": (
    routeRecordNormalized: RouteRecordNormalized
  ) => RouteMeta | Promise<RouteMeta>;
}
