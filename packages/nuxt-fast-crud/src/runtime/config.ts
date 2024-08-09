import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types";

export const name = "@ucstu/nuxt-fast-crud";
export const version = "2.0.6";
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
  const options = _options as ModulePublicRuntimeConfig[typeof configKey];

  nuxt.options.runtimeConfig.public[configKey] =
    options as (typeof nuxt.options.runtimeConfig.public)[typeof configKey];
  nuxt.options.appConfig[configKey] = configs;

  return options;
}
