import type { ModuleConfig, ModuleConfigDefaults } from "./config";
import type { ModulePublicRuntimeConfig } from "./module";

export type * from "./config";
export type * from "./module";
export type * from "./base";

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module "@nuxt/schema" {
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {}
  interface CustomAppConfig {
    fastCrud?: ModuleConfig;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
declare module "@ucstu/nuxt-fast-utils/types" {
  interface ModuleConfigs {
    fastCrud: ModuleConfigDefaults;
  }
}
/* eslint-enable @typescript-eslint/no-empty-object-type */
