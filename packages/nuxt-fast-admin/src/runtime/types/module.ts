import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";

export interface ModuleOptions {
  /**
   * 可选模块
   * @default []
   */
  modules?: Array<"auth" | "crud" | "fetch">;
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastCrud: ModuleOptionsDefaults;
}
