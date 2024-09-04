import type { ModuleConfig, ModuleConfigDefaults } from "./config";
import type { ModulePublicRuntimeConfig } from "./module";

export type * from "./config";
export type * from "./module";

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module "@nuxt/schema" {
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {}
  interface CustomAppConfig {
    amis?: ModuleConfig;
  }
}

declare module "@ucstu/nuxt-fast-utils/types" {
  interface ModuleConfigs {
    amis: ModuleConfigDefaults;
  }
}
/* eslint-enable @typescript-eslint/no-empty-object-type */
