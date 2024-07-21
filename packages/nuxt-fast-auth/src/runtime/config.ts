import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
  ModulePublicRuntimeConfig,
} from "./types";

export const name = "@ucstu/nuxt-fast-auth";
export const version = "2.0.0";
export const configKey = "fastAuth";

export const defaults: ModuleOptionsDefaults = {
  provider: "local",
};

export const configs: ModuleConfigDefaults = {
  provider: {
    // @ts-ignore
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
  const options = _options as ModulePublicRuntimeConfig[typeof configKey];

  nuxt.options.runtimeConfig.public[configKey] = options as any;
  nuxt.options.appConfig[configKey] = configs;

  return options;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    // @ts-ignore
    fastAuth?: ModuleConfig;
  }
}

declare module "@ucstu/nuxt-fast-utils/types" {
  interface ModuleConfigs {
    // @ts-ignore
    fastAuth: ModuleConfigDefaults;
  }
}
