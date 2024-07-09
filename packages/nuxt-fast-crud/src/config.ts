import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

export { name, version } from "../package.json";

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
