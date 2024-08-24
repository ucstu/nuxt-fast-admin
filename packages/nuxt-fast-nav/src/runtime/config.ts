import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types/index";

export const name = "@ucstu/nuxt-fast-nav";
export const version = "2.0.9";
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

  nuxt.options.runtimeConfig.public[configKey] =
    options as (typeof nuxt.options.runtimeConfig.public)[typeof configKey];
  nuxt.options.appConfig[configKey] = configs;

  return options;
}
