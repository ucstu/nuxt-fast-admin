import {
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "../utils";
import {
  configKey,
  defaults,
  initModule,
  name,
  version,
} from "./runtime/config";
import type { ModuleOptions } from "./runtime/types";

export type {
  ModuleOptions,
  ModulePublicRuntimeConfig,
} from "./runtime/types/module";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
  },
  defaults,
  setup(_options, nuxt) {
    const options = initModule(_options, nuxt);

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      configKey,
      __dirname,
    });

    const { resolve } = createResolver(import.meta.url);

    addPlugin({
      name,
      src: resolve("./runtime/plugins/plugin.ts"),
    });

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: [
        "useNuxtReady",
        "useNuxtStorage",
        "useNuxtAppBack",
        "tryUseNuxtAppBack",
        "createNuxtGlobalState",
        "createNuxtSharedComposable",
      ],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: ["cookieStorage", "sessionCookieStorage"],
    });
  },
});
