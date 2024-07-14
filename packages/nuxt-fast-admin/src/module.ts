import {
  addComponent,
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

export type * from "./runtime/types/module";

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

    if (options.modules.includes("auth")) {
      addComponent({
        filePath: resolve("./runtime/components/fa/pages/auth.vue"),
        name: "FaPagesAuth",
      });
      extendPages((pages) => {
        if (pages.length === 0) return;
        pages.push({
          path: resolve("./runtime/pages/auth.vue"),
        });
      });
    }
  },
});
