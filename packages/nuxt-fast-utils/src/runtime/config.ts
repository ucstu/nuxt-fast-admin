import type { Nuxt, PublicRuntimeConfig } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./types";

export const name = "@ucstu/nuxt-fast-utils";
export const version = "1.1.8";
export const configKey = "fastUtils";

export const defaults: ModuleOptionsDefaults = {};

export const configs: ModuleConfigDefaults = {};

export function initModule(
  _options: ModuleOptions,
  nuxt: Nuxt
): ModuleOptionsDefaults {
  const options = _options as ModuleOptionsDefaults;
  const { ssr } = nuxt.options;

  nuxt.options.runtimeConfig.public[configKey] = {
    ...options,
    ssr,
  } as unknown as PublicRuntimeConfig[typeof configKey];
  nuxt.options.appConfig[configKey] = configs;

  return options;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    [configKey]?: ModuleConfig;
  }
}