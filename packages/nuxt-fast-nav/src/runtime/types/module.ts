import type { Ref } from "#imports";
import type { RouteLocationNormalizedGeneric } from "#vue-router";
import type { HookResult } from "@nuxt/schema";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/types";
import type { FsNavHistory } from "./base";

export interface ModuleOptions {
  /**
   * 检查
   */
  check?: {
    /**
     * 是否开启 menu.parent 检查
     * @default true
     */
    parent?: boolean;
  };
  /**
   * 自动填充元信息
   * @default true
   */
  autoFillMeta?: boolean;
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastNav: ModuleOptionsDefaults;
}

export interface ModuleRuntimeHooks {
  /**
   * 获取历史记录
   * @param to 路由
   * @param result 结果
   */
  "fast-nav:get-history": (
    to: RouteLocationNormalizedGeneric,
    result: Ref<FsNavHistory>
  ) => HookResult;
  /**
   * 历史记录是否相等
   * @param a a
   * @param b b
   * @param result 结果
   */
  "fast-nav:history-equal": (
    a: FsNavHistory,
    b: FsNavHistory,
    result: Ref<boolean>
  ) => HookResult;
}
