import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModuleOptions {}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  naiveUi: ModuleOptionsDefaults;
}
