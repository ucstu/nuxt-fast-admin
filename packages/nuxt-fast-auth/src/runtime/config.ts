import type { Nuxt, PublicRuntimeConfig } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./types";

export const name = "@ucstu/nuxt-fast-auth";
export const version = "1.1.8";
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
  },
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
