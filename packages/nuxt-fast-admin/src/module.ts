import FastCrud from "@fast-crud/fast-crud";
import {
  addComponent,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { camelCase, upperFirst } from "lodash-es";
import { name, version } from "../package.json";
import type {
  FsCrudConfig,
  FsCrudConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

const configKey = "fastAdmin";

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

    nuxt.options.appConfig[configKey] = {
      uiSetupOptions: {},
      fsSetupOptions: {
        logger: {
          off: {
            tableColumns: false,
          },
        },
      },
    } satisfies FsCrudConfigDefaults;

    if (options.framework === "naive") {
      if (process.env.NODE_ENV === "development") {
        const optimizeDeps = ["naive-ui"];
        extendViteConfig((config) => {
          config.optimizeDeps ||= {};
          config.optimizeDeps.include ||= [];
          for (const item of optimizeDeps) {
            if (!config.optimizeDeps.include.includes(item)) {
              config.optimizeDeps.include.push(`${name} > ${item}`);
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
    }

    if (process.env.NODE_ENV === "development") {
      const optimizeDeps = [
        "@fast-crud/fast-crud",
        "@fast-crud/fast-extends",
        "@fast-crud/ui-interface",
        `@fast-crud/ui-${options.framework}`,
      ];
      extendViteConfig((config) => {
        config.optimizeDeps ||= {};
        config.optimizeDeps.include ||= [];
        for (const item of optimizeDeps) {
          if (!config.optimizeDeps.include.includes(item)) {
            config.optimizeDeps.include.push(`${name} > ${item}`);
          }
        }
      });
    }
    const transpile = [
      "@fast-crud/fast-crud",
      "@fast-crud/fast-extends",
      "@fast-crud/ui-interface",
      `@fast-crud/ui-${options.framework}`,
    ];
    for (const item of transpile) {
      if (!nuxt.options.build.transpile.includes(item)) {
        nuxt.options.build.transpile.push(item);
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
      src: resolve(`./runtime/plugins/${options.framework}`),
    });

    const components = Object.keys(FastCrud).filter((name) =>
      /^Fs[A-Z]|fs-[a-z]/.test(name),
    );

    const clientOnlyComponents = ["FsCrud"];

    components.forEach((name) => {
      addComponent({
        name,
        export: name,
        filePath: resolve("./runtime/components"),
        mode: clientOnlyComponents.includes(upperFirst(camelCase(name)))
          ? "client"
          : "all",
      });
    });

    const composables = Object.keys(FastCrud).filter(
      (name) => /^use[A-Z]/.test(name) || ["dict"].includes(name),
    );

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: composables,
    });
  },
});

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    [configKey]?: FsCrudConfig;
  }
}
