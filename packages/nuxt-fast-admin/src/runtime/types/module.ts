import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/types";

export interface ModuleOptions {
  /**
   * 使用的框架
   */
  framework?: "element" | "antdv" | "antdv4" | "naive";
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastCrud: ModuleOptionsDefaults;
}
