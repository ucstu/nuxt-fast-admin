import {
  addComponent,
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

    addComponent({
      filePath: resolve("./runtime/components/v-node.vue"),
      name: "VNode",
    });
    addComponent({
      filePath: resolve("./runtime/components/fa/app.vue"),
      name: "FaApp",
    });
    addComponent({
      filePath: resolve("./runtime/components/fa/icon.vue"),
      name: "FaIcon",
    });
    addComponent({
      filePath: resolve("./runtime/components/fa/error.vue"),
      name: "FaError",
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

    addComponent({
      filePath: resolve("./runtime/components/fa/layouts/full.vue"),
      name: "FaLayoutsFull",
    });
    if (options.features.layouts.full) {
      addLayout(resolve("./runtime/layouts/full.vue"), "full");
    }

    addComponent({
      filePath: resolve("./runtime/components/fa/layouts/default/index.vue"),
      name: "FaLayoutsDefault",
    });
    addComponent({
      filePath: resolve("./runtime/components/fa/layouts/default/menu.vue"),
      name: "FaLayoutsDefaultMenu",
    });
    addComponent({
      filePath: resolve("./runtime/components/fa/layouts/default/header.vue"),
      name: "FaLayoutsDefaultHeader",
    });
    addComponent({
      filePath: resolve("./runtime/components/fa/layouts/default/tabbar.vue"),
      name: "FaLayoutsDefaultTabbar",
    });
    if (options.features.layouts.default) {
      addLayout(resolve("./runtime/layouts/default.vue"), "default");
    }

    addComponent({
      filePath: resolve("./runtime/components/fa/pages/auth.vue"),
      name: "FaPagesAuth",
    });
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
          },
        });
      });
    }

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: [
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
