import {
  addComponent,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
} from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import Naive from "naive-ui";
import { name, version } from "../package.json";
import type { ModuleOptions, ModuleOptionsDefaults } from "./runtime/types";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "naiveUi",
    compatibility: {
      nuxt: "^3.10.0",
    },
  },
  defaults: {
    defaultTheme: "auto",
  } satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    const options = _options as ModuleOptionsDefaults;
    const { ssr, rootDir } = nuxt.options;

    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.naiveUi = {
      ...options,
      ssr,
    } as any;

    nuxt.options.appConfig.naiveUi = {
      defaultTheme: "auto",
    } satisfies AppConfigInput["naiveUi"];

    // Nuxt Bug Patch
    if (__dirname.endsWith("src")) {
      nuxt.hook("prepare:types", ({ references }) => {
        references.push({
          types: getModulePath(rootDir),
        });
      });
    }

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

    addPlugin({
      name,
      mode: "server",
      src: resolve("./runtime/plugins/naive.server"),
    });

    const naiveComponents = Object.keys(Naive).filter((name) =>
      /^(N[A-Z]|n-[a-z])/.test(name),
    );

    const clientOnlyComponents = ["NDrawer", "NDrawerContent", "NModal"];

    naiveComponents.forEach((name) => {
      addComponent({
        export: name,
        name,
        filePath: resolve("./runtime/components"),
        mode: clientOnlyComponents.includes(name) ? "client" : "all",
      });
    });

    const composables = Object.keys(Naive).filter((name) =>
      /^use[A-Z]/.test(name),
    );

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: [...composables, "useNiaveUiTheme"],
    });
  },
});

function getModulePath(rootDir: string) {
  return rootDir.endsWith("playground") ? "../../dist/types" : "../dist/types";
}
