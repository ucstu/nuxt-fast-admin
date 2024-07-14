import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./types";

export const name = "@ucstu/nuxt-fast-nav";
export const version = "1.1.8";
export const configKey = "fastNav";

export const defaults: ModuleOptionsDefaults = {
  check: {
    parent: true,
  },
};

export const configs: ModuleConfigDefaults = {
  menus: [],
  menu: {
    icon: "material-symbols:lists",
    show: false,
    disabled: false,
    order: 0,
  },
  page: {
    icon: "material-symbols:pages",
    menu: {
      has: true,
      show: true,
      disabled: false,
      order: 0,
    },
    tab: {
      has: true,
      show: true,
    },
  },
  home: "/",
  keys: ["path"],
};

export function initModule(
  _options: ModuleOptions,
  nuxt: Nuxt,
): ModuleOptionsDefaults {
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
