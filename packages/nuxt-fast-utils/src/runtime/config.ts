import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types/index";

export const name = "@ucstu/nuxt-fast-utils";
export const version = "2.0.9";
export const configKey = "fastUtils";

export const defaults: ModuleOptionsDefaults = {};

export const configs: ModuleConfigDefaults = {
  keys: ["path", "query"],
};

export function initModule(
  _options: ModuleOptions,
  nuxt: Nuxt,
): ModuleOptionsDefaults {
  const options = _options as ModulePublicRuntimeConfig[typeof configKey];
  const { ssr } = nuxt.options;

  nuxt.options.runtimeConfig.public[configKey] = {
    ...options,
    ssr,
  } as (typeof nuxt.options.runtimeConfig.public)[typeof configKey];
  nuxt.options.appConfig[configKey] = configs;

  return options;
}
