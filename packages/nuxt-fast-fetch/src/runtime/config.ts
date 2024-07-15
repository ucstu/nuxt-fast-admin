import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./types";

export const name = "@ucstu/nuxt-fast-fetch";
export const version = "1.1.8";
export const configKey = "fastFetch";

export const defaults: ModuleOptionsDefaults = {
  clients: {},
};

export const configs: ModuleConfigDefaults = {};

export function initModule(
  _options: ModuleOptions,
  nuxt: Nuxt,
): ModuleOptionsDefaults {
  const options = _options as ModuleOptionsDefaults;

  nuxt.options.runtimeConfig.public[configKey] = options as any;
  nuxt.options.appConfig[configKey] = configs;

  return options;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    [configKey]?: ModuleConfig;
  }
}
