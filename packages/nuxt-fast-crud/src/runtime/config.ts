import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types";

export const name = "@ucstu/nuxt-fast-crud";
export const version = "2.0.4";
export const configKey = "fastCrud";

export const defaults: ModuleOptionsDefaults = {
  framework: "naive",
};

export const configs: ModuleConfigDefaults = {
  uiSetupOptions: {},
  fsSetupOptions: {
    logger: {
      off: {
        tableColumns: false,
      },
    },
  },
};

export function initModule(
  _options: ModuleOptions,
  nuxt: Nuxt,
): ModuleOptionsDefaults {
  const options = _options as ModulePublicRuntimeConfig[typeof configKey];

  nuxt.options.runtimeConfig.public[configKey] = options as any;
  nuxt.options.appConfig[configKey] = configs;

  return options;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    // @ts-ignore
    fastCrud?: ModuleConfig;
  }
}

declare module "@ucstu/nuxt-fast-utils/types" {
  interface ModuleConfigs {
    // @ts-ignore
    fastCrud: ModuleConfigDefaults;
  }
}
