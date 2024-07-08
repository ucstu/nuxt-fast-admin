import { addImportsSources, createResolver, defineNuxtModule } from "@nuxt/kit";
import { name, version } from "../package.json";
import { addModuleTypeTemplate } from "../utils";
import type {
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

export const configKey = "fastUtils";

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

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: [
        "useNuxtReady",
        "useNuxtConfig",
        "computedEager",
        "eagerComputed",
        "createGlobalState",
        "createSharedComposable",
        "useStorage",
      ],
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
