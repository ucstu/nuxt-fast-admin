import type { Nuxt } from "@nuxt/schema";
import { name, version } from "../package.json";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

export { name, version };

export const configKey = "fastUtils";

export const defaults: ModuleOptionsDefaults = {};

export const configs: ModuleConfigDefaults = {};

export function initModule(_options: ModuleOptions, nuxt: Nuxt) {
  const options = _options as ModuleOptionsDefaults;
  const { ssr } = nuxt.options;

  nuxt.options.runtimeConfig.public[configKey] = {
    ...options,
    ssr,
  };
  nuxt.options.appConfig[configKey] = configs;

  return options;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    [configKey]?: ModuleConfig;
  }
}
