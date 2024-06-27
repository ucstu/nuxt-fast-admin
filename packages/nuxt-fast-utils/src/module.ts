import {
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
} from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import { name, version } from "../package.json";
import type {
  FsUtilsConfig,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";
import { addModuleTypeTemplate } from "./utils";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "fastUtils",
  },
  defaults: {} satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    const options = _options as ModuleOptionsDefaults;
    const { ssr } = nuxt.options;

    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.fastUtils = {
      ...options,
      ssr,
    };

    nuxt.options.appConfig.fastUtils = {} satisfies AppConfigInput["fastUtils"];

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
      imports: ["toRefDeep", "useFuConfig", "getFuConfig", "useFuStorage"],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: ["cookieStorage", "sessionCookieStorage"],
    });
  },
});

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    fastUtils?: FsUtilsConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    fastUtils?: FsUtilsConfig;
  }
}
