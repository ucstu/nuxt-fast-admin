import type { Nuxt, PublicRuntimeConfig } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./types";

export const name = "@ucstu/nuxt-fast-crud";
export const version = "1.1.8";
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
  nuxt: Nuxt
): ModuleOptionsDefaults {
  const options = _options as ModuleOptionsDefaults;

  nuxt.options.runtimeConfig.public[configKey] =
    options as unknown as PublicRuntimeConfig[typeof configKey];
  nuxt.options.appConfig[configKey] = configs;

  return options;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    [configKey]?: ModuleConfig;
  }
}

declare module "@ucstu/nuxt-fast-utils/types" {
  interface AppConfigOverrides {
    [configKey]: ModuleConfigDefaults;
  }
}