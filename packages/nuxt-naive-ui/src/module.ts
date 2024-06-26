import {
  addComponent,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
} from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { camelCase, upperFirst } from "lodash-es";
import Naive from "naive-ui";
import { name, version } from "../package.json";
import type {
  ModuleOptions,
  ModuleOptionsDefaults,
  NaiveUiConfig,
} from "./runtime/types";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "naiveUi",
  },
  defaults: {} satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    installModule("@ucstu/nuxt-fast-utils");

    const options = _options as ModuleOptionsDefaults;

    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.naiveUi = options;

    nuxt.options.appConfig.naiveUi = {
      defaultTheme: "auto",
    } satisfies AppConfigInput["naiveUi"];

    if (process.env.NODE_ENV === "development") {
      const optimizeDeps = ["naive-ui"];
      extendViteConfig((config) => {
        config.optimizeDeps ||= {};
        config.optimizeDeps.include ||= [];
        for (const item of optimizeDeps) {
          if (!config.optimizeDeps.include.includes(item)) {
            config.optimizeDeps.include.push(item);
          }
        }
      });
      const transpile = ["@juggle/resize-observer"];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    } else {
      const transpile = [
        "naive-ui",
        "vueuc",
        "@css-render/vue3-ssr",
        "@juggle/resize-observer",
        "@iconify/vue",
      ];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    }

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      __dirname,
    });

    addPlugin({
      name,
      mode: "server",
      src: resolve("./runtime/plugins/plugin"),
    });

    const components = Object.keys(Naive).filter((name) =>
      /^N[A-Z]|n-[a-z]/.test(name)
    );

    const clientOnlyComponents = ["NDrawer", "NDrawerContent", "NModal"];

    components.forEach((name) => {
      addComponent({
        export: name,
        name,
        filePath: resolve("./runtime/components"),
        mode: clientOnlyComponents.includes(upperFirst(camelCase(name)))
          ? "client"
          : "all",
      });
    });

    const composables = Object.keys(Naive).filter((name) =>
      /^use[A-Z]/.test(name)
    );

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: [...composables, "useNaiveUiTheme", "useNaiveUiThemeConfig"],
    });
  },
});

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    naiveUi?: NaiveUiConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    naiveUi?: NaiveUiConfig;
  }
}
