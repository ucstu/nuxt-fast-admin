import {
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
} from "@nuxt/kit";
import { name, version } from "../package.json";
import { addModuleTypeTemplate } from "../utils";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

export type * from "./runtime/types/module";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
  },
  defaults: {} satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    const options = _options as ModuleOptionsDefaults;
    const { ssr } = nuxt.options;

    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public[configKey] = {
      ...options,
      ssr,
    };

    nuxt.options.appConfig[configKey] = {} satisfies ModuleConfigDefaults;

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
      imports: ["useSafeNuxtApp", "useStorage", "toRefDeep", "computedEager"],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: ["cookieStorage", "sessionCookieStorage"],
    });
  },
});

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    [configKey]?: ModuleConfig;
  }
}
