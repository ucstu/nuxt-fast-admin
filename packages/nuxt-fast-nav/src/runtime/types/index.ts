import type { ModuleConfig, ModuleConfigDefaults } from "./config";
import type { ModulePublicRuntimeConfig, ModuleRuntimeHooks } from "./module";

export type * from "./base";
export type * from "./config";
export type * from "./module";

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module "#app" {
  interface RuntimeNuxtHooks extends ModuleRuntimeHooks {}
}

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {}
  interface CustomAppConfig {
    fastNav?: ModuleConfig;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
declare module "@ucstu/nuxt-fast-utils/types" {
  interface ModuleConfigs {
    fastNav: ModuleConfigDefaults;
  }
}
/* eslint-enable @typescript-eslint/no-empty-object-type */
