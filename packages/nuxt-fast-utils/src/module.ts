import { addImportsSources, createResolver, defineNuxtModule } from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import { name, version } from "../package.json";
import { addModuleTypeTemplate } from "../utils";
import type {
  FsUtilsConfig,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

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

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: ["toRefDeep", "useStorage"],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: ["cookieStorage", "sessionCookieStorage", "override"],
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
