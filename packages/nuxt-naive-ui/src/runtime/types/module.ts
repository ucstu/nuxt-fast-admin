import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/types";

export interface ModuleOptions {}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  naiveUi: ModuleOptionsDefaults;
}
