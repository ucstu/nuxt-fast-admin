import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types/index";

export const name = "@ucstu/nuxt-naive-ui";
export const version = "2.0.10";
export const configKey = "naiveUi";

export const defaults: ModuleOptionsDefaults = {};

export const configs: ModuleConfigDefaults = {
  defaultTheme: "auto",
  customThemes: {},
  themesOverrides: {},
};

export function initModule(
  _options: ModuleOptions,
  nuxt: Nuxt,
): ModuleOptionsDefaults {
  const options = _options as ModulePublicRuntimeConfig[typeof configKey];

  nuxt.options.runtimeConfig.public[configKey] =
    options as (typeof nuxt.options.runtimeConfig.public)[typeof configKey];
  nuxt.options.appConfig[configKey] = configs;

  return options;
}
