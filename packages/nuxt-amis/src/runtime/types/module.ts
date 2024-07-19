import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";

export interface ModuleOptions {}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  amis: ModuleOptionsDefaults;
}
