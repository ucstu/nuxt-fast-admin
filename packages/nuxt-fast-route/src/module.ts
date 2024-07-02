import {
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { name, version } from "../package.json";
import type {
  FsRouteConfig,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "fastRoute",
  },
  defaults: {} satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    installModule("@ucstu/nuxt-fast-utils");

    const options = _options as ModuleOptionsDefaults;
    const { ssr } = nuxt.options;

    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.fastRoute = {
      ...options,
      ssr,
    };

    nuxt.options.appConfig.fastRoute = {} satisfies AppConfigInput["fastRoute"];

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      __dirname,
    });

    addPlugin({
      name,
      src: resolve("./runtime/plugins/plugin"),
    });

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: ["useRouteMeta", "getRouteMeta", "useRouteMetas"],
    });
  },
});

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    fastRoute?: FsRouteConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    fastRoute?: FsRouteConfig;
  }
}
