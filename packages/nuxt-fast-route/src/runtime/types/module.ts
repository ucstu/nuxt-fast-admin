import type { Ref } from "#imports";
import type { RouteMeta, RouteRecordNormalized } from "#vue-router";
import type { HookResult } from "@nuxt/schema";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/types";

export interface ModuleOptions {}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastRoute: ModuleOptionsDefaults;
}

export interface ModuleRuntimeHooks {
  /**
   * 路由处理前
   */
  "fast-route:brfore": () => HookResult;
  /**
   * 路由处理后
   */
  "fast-route:after": () => HookResult;
  /**
   * 获取路由元信息
   * @param route 路由
   * @param result 结果
   */
  "fast-route:get-meta": (
    route: RouteRecordNormalized,
    result: Ref<RouteMeta>
  ) => HookResult;
}
