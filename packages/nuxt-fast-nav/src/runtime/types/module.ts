import type { HookResult } from "@nuxt/schema";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/types";
import type { FsNavMenu, FsNavMenuFilled, FsNavMenuKeys } from "./base";

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
  "fast-nav:menus": (menus: Array<FsNavMenu<FsNavMenuKeys>>) => HookResult;
  "fast-nav:menu": (result: FsNavMenuFilled) => HookResult;
}
