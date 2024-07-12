import type { Nuxt } from "@nuxt/schema";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./types";

export { name, version } from "../../package.json";

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
        unAuth: true,
        passed: false,
        failed: true,
      },
    },
  },
  home: "/",
  signIn: "/auth",
  signOut: "/auth",
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
