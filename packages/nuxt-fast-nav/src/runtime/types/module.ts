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
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastNav: ModuleOptionsDefaults;
}

export interface ModuleRuntimeHooks {
  "fast-nav:get-history": (
    to: RouteLocationNormalizedGeneric,
    result: FsNavHistory
  ) => HookResult;
}
