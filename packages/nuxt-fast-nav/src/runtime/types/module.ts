import type { RequiredDeep } from "type-fest";
import type { FsNavMenuFilled, FsNavPageFilled } from "./base";

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

declare module "@ucstu/nuxt-fast-utils/types" {
  interface FsUtilsHooks {
    "fast-nav:menu-fill": (
      menu: FsNavMenuFilled
    ) => FsNavMenuFilled | Promise<FsNavMenuFilled>;
    "fast-nav:page-fill": (
      page: FsNavPageFilled
    ) => FsNavPageFilled | Promise<FsNavPageFilled>;
  }
}
