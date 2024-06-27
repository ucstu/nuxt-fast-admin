import type { RouteMeta, RouteRecordNormalized } from "#vue-router";
import type { HookResult } from "@nuxt/schema";
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
  /**
   * 路由钩子
   * 用于修改路由元信息
   * @param route 路由
   * @param result 结果
   */
  "fast-utils:route": (
    route: RouteRecordNormalized,
    result: RouteMeta
  ) => HookResult;
}
