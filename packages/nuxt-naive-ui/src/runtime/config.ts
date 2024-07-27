import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types";

export const name = "@ucstu/nuxt-naive-ui";
export const version = "2.0.5";
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

  nuxt.options.runtimeConfig.public[configKey] = options as any;
  nuxt.options.appConfig[configKey] = configs;

  return options;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    // @ts-ignore
    naiveUi?: ModuleConfig;
  }
}

declare module "@ucstu/nuxt-fast-utils/types" {
  interface ModuleConfigs {
    // @ts-ignore
    naiveUi: ModuleConfigDefaults;
  }
}
