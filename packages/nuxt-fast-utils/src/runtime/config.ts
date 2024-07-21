import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types";

export const name = "@ucstu/nuxt-fast-utils";
export const version = "2.0.0";
export const configKey = "fastUtils";

export const defaults: ModuleOptionsDefaults = {};

export const configs: ModuleConfigDefaults = {
  keys: ["path", "query"],
};

export function initModule(
  _options: ModuleOptions,
  nuxt: Nuxt
): ModuleOptionsDefaults {
  const options = _options as ModulePublicRuntimeConfig[typeof configKey];
  const { ssr } = nuxt.options;

  nuxt.options.runtimeConfig.public[configKey] = {
    ...options,
    ssr,
  } as any;
  nuxt.options.appConfig[configKey] = configs;

  return options;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    // @ts-ignore
    fastUtils?: ModuleConfig;
  }
}

declare module "./types" {
  interface ModuleConfigs {
    // @ts-ignore
    fastUtils: ModuleConfigDefaults;
  }
}
