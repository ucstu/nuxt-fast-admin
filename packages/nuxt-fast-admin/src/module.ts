import {
  addComponent,
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
  async setup(_options, nuxt) {
    await installModule("@nuxt/icon");
    await installModule("@ucstu/nuxt-fast-nav");
    await installModule("@ucstu/nuxt-fast-utils");
    await installModule("@ucstu/nuxt-naive-ui");

    if (__dirname.endsWith("src")) {
      await installModule("@ucstu/nuxt-fast-auth");
      await installModule("@ucstu/nuxt-fast-crud");
      await installModule("@ucstu/nuxt-fast-fetch");
    }

    const options = initModule(_options, nuxt);
    options.modules ??= [];
    options.modules.push(
      ...nuxt.options._installedModules.map((m) => m.meta.name),
    );

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
    if (options.features.layouts.full) {
      addLayout(resolve("./runtime/layouts/full.vue"), "full");
    }
    if (options.features.layouts.default) {
      addLayout(resolve("./runtime/layouts/default.vue"), "default");
    }

    if (options.modules.includes("@ucstu/nuxt-fast-auth")) {
      addPlugin({
        name: `${name}:auth`,
        src: resolve("./runtime/plugins/auth.ts"),
      });
      addComponent({
        filePath: resolve("./runtime/components/fa/pages/auth.vue"),
        name: "FaPagesAuth",
      });

      if (options.features.pages.auth) {
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
    }

    if (options.modules.includes("@ucstu/nuxt-fast-crud")) {
      addComponent({
        filePath: resolve("./runtime/components/fa/crud.vue"),
        name: "FaCrud",
      });

      if (options.modules.includes("@ucstu/nuxt-fast-fetch")) {
        extendPages((pages) => {
          if (pages.length === 0) return;
          pages.push({
            file: resolve("./runtime/pages/crud.vue"),
            path: "/crud/:api()/:name()",
            name: "crud-api-name",
            meta: {
              title: "CRUD",
            },
          });
        });
      }
    }

    addComponentsDir({
      path: resolve("./runtime/components"),
      ignore: ["fa/crud.vue", "fa/pages/auth.vue"],
    });

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: [
        "getAdminCrud",
        "useAdminCrud",
        "getAdminMenu",
        "useAdminMenu",
        "useAdminMenuGlobal",
      ],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: ["isFetchError", "handleError"],
    });
  },
});
