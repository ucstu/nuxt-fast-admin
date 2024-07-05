import {
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { name, version } from "../package.json";
import type { createRouteMetas } from "./runtime/composables";
import type {
  FsRouteConfig,
  FsRouteConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

const configKey = "fastRoute";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
  },
  defaults: {} satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    installModule("@ucstu/nuxt-fast-utils");

    const options = _options as ModuleOptionsDefaults;

    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public[configKey] = options;

    nuxt.options.appConfig[configKey] = {} satisfies FsRouteConfigDefaults;

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
    [configKey]?: FsRouteConfig;
  }
}

declare module "#app" {
  interface NuxtApp {
    $fastRoute: {
      routeMetas: ReturnType<typeof createRouteMetas>;
    };
  }
}
