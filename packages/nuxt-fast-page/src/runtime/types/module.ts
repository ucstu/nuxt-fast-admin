import type { Ref } from "#imports";
import type { RouteMeta } from "#vue-router";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/types";

export interface ModuleOptions {}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastRoute: ModuleOptionsDefaults;
}

export interface ModuleRuntimeHooks {
  /**
   * 获取路由元信息
   * @param route 路由
   * @param result 结果
   */
  "fast-route:get-meta": (path: string, result: Ref<RouteMeta>) => void;
}
