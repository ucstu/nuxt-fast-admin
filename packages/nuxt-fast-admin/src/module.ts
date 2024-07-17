import {
  addComponentsDir,
  addImportsSources,
  addLayout,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendPages,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
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
    installModule("@nuxt/icon");
    installModule("@ucstu/nuxt-fast-nav");
    installModule("@ucstu/nuxt-fast-utils");
    installModule("@ucstu/nuxt-naive-ui");

    const options = initModule(_options, nuxt);

    if (__dirname.endsWith("src")) {
      options.modules.push("auth", "crud", "fetch");
    }

    for (const module of options.modules) {
      installModule(`@ucstu/nuxt-fast-${module}`);
    }

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      configKey,
      __dirname,
    });

    const { resolve } = createResolver(import.meta.url);

    addPlugin({
      name: `${name}:config`,
      src: resolve("./runtime/plugins/config.ts"),
    });
    addPlugin({
      name,
      src: resolve("./runtime/plugins/plugin.ts"),
    });
    if (options.modules.includes("auth")) {
      addPlugin({
        name: `${name}:auth`,
        src: resolve("./runtime/plugins/auth.ts"),
      });
    }

    if (options.features.layouts.full) {
      addLayout(resolve("./runtime/layouts/full.vue"), "full");
    }
    if (options.features.layouts.default) {
      addLayout(resolve("./runtime/layouts/default.vue"), "default");
    }
    if (
      (options.features.pages.auth === "auto" &&
        options.modules.includes("auth")) ||
      options.features.pages.auth
    ) {
      extendPages((pages) => {
        if (pages.length === 0) return;
        pages.push({
          file: resolve("./runtime/pages/auth.vue"),
          path: "/auth",
          name: "auth",
          meta: {
            layout: "full",
            auth: false,
            menu: {
              show: false,
            },
            tab: {
              show: false,
            },
          },
        });
      });
    }

    addComponentsDir({
      path: resolve("./runtime/components"),
    });

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: [
        "getAdminCrud",
        "useAdminCrud",
        "getAdminMenuOptions",
        "useAdminMenuOptions",
        "useAdminGlobalMenuOptions",
      ],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: ["isFetchError", "handleError"],
    });
  },
});
