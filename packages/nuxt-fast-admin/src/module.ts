import {
  addComponent,
  addLayout,
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
      filePath: resolve("./runtime/components/fa/icon.vue"),
      name: "FaIcon",
    });
    addComponent({
      filePath: resolve("./runtime/components/fa/error.vue"),
      name: "FaError",
    });

    if (options.features.layouts.full) {
      addComponent({
        filePath: resolve("./runtime/components/fa/layouts/full.vue"),
        name: "FaLayoutsFull",
      });
    } else {
      addLayout(resolve("./runtime/components/fa/layouts/full.vue"), "full");
    }

    if (options.features.layouts.default) {
      addComponent({
        filePath: resolve("./runtime/components/fa/layouts/default/index.vue"),
        name: "FaLayoutsDefault",
      });
    } else {
      addLayout(
        resolve("./runtime/components/fa/layouts/default/index.vue"),
        "default"
      );
    }

    if (options.modules.includes("auth")) {
      if (options.features.pages.auth) {
        addComponent({
          filePath: resolve("./runtime/components/fa/pages/auth.vue"),
          name: "FaPagesAuth",
        });
      } else {
        extendPages((pages) => {
          if (pages.length === 0) return;
          pages.push({
            path: resolve("./runtime/components/fa/pages/auth.vue"),
            meta: {
              layout: "full",
              auth: false,
            },
          });
        });
      }
    }
  },
});
