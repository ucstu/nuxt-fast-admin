import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types";

export const name = "@ucstu/nuxt-fast-nav";
export const version = "2.0.1";
export const configKey = "fastNav";

export const defaults: ModuleOptionsDefaults = {
  features: {
    check: {
      parent: false,
    },
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
    fastNav?: ModuleConfig;
  }
}

declare module "@ucstu/nuxt-fast-utils/types" {
  interface ModuleConfigs {
    // @ts-ignore
    fastNav: ModuleConfigDefaults;
  }
}
