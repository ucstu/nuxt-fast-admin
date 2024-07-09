import type { Nuxt } from "@nuxt/schema";
import { name, version } from "../package.json";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

export { name, version };

export const configKey = "naiveUi";

export const defaults: ModuleOptionsDefaults = {};

export const configs: ModuleConfigDefaults = {
  defaultTheme: "auto",
  customThemes: {},
  themesOverrides: {},
};

export function initModule(_options: ModuleOptions, nuxt: Nuxt) {
  const options = _options as ModuleOptionsDefaults;

  nuxt.options.runtimeConfig.public[configKey] = options;
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
