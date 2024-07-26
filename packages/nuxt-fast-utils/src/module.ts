import {
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
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
  ModuleRuntimeHooks,
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
    if (nuxt.options.dev) {
      const optimizeDeps = ["cookie-storage", "nanoid", "query-string"];
      extendViteConfig((config) => {
        config.optimizeDeps ||= {};
        config.optimizeDeps.include ||= [];
        for (const item of optimizeDeps) {
          if (!config.optimizeDeps.include.includes(item)) {
            config.optimizeDeps.include.push(`${name} > ${item}`);
          }
        }
      });
    } else {
      const transpile = ["cookie-storage", "nanoid", "query-string"];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    }

    addPlugin({
      name,
      src: resolve("./runtime/plugins/plugin"),
    });

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: [
        "toRefDeep",
        "useNuxtReady",
        "reactifyEager",
        "useNuxtStorage",

        "$useRouter",
        "$useAppConfig",
        "$useRuntimeConfig",

        "getModuleConfig",
        "useModuleConfig",

        "createNuxtGlobalState",
        "createNuxtSharedComposable",
      ],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: [
        "toEqual",
        "resolveTo",
        "getToPath",
        "isNuxtApp",
        "cookieStorage",
        "sessionCookieStorage",
      ],
    });
  },
});
