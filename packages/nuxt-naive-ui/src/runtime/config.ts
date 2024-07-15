import type { Nuxt, PublicRuntimeConfig } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./types";

export const name = "@ucstu/nuxt-naive-ui";
export const version = "1.1.8";
export const configKey = "naiveUi";

export const defaults: ModuleOptionsDefaults = {};

export const configs: ModuleConfigDefaults = {
  defaultTheme: "auto",
  customThemes: {},
  themesOverrides: {},
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
