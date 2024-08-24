import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types/index";

export const name = "@ucstu/nuxt-fast-auth";
export const version = "2.0.9";
export const configKey = "fastAuth";

export const defaults: ModuleOptionsDefaults = {
  provider: "local",
};

export const configs: ModuleConfigDefaults = {
  provider: {
    refreshOnWindowFocus: true,
    refreshTokenExpires: 256 * 24 * 60 * 60 * 1000,
    tokenExpires: 256 * 24 * 60 * 60 * 1000,
    tokenRefresh: 5 * 60 * 1000,
  } as ModuleConfigDefaults["provider"],
  session: {
    refreshOnWindowFocus: false,
    refreshPeriodically: 0,
  },
  page: {
    auth: {
      auth: false,
      redirect: {
        anonymous: true,
        passed: false,
        failed: true,
      },
    },
  },
  home: "/",
  signIn: "/auth",
  signOut: "/auth",
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
