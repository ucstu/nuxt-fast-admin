import type { RequiredDeep } from "type-fest";

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
