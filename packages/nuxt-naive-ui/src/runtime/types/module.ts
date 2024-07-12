import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import type { configKey } from "../config";

export interface ModuleOptions {}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  [configKey]: ModuleOptionsDefaults;
}
