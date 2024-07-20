import {
  addComponent,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import MagicString from "magic-string";
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
  async setup(_options, nuxt) {
    await installModule("@ucstu/nuxt-fast-utils");
    await installModule("nuxt-monaco-editor");

    const options = initModule(_options, nuxt);

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      configKey,
      __dirname,
    });

    const { resolve } = createResolver(import.meta.url);

    extendViteConfig((config) => {
      config.plugins ??= [];
      config.plugins.push({
        name,
        enforce: "pre",
        async transform(code: string, id: string) {
          if (id.match(/amis\/lib\/themes\/default.css/)) {
            const ms = new MagicString(code);
            ms.replace("max-width: fill-available", "max-width: stretch");
            return {
              code: ms.toString(),
              map: ms.generateMap(),
            };
          }
        },
      });
    });

    addPlugin({
      name,
      src: resolve("./runtime/plugins/plugin"),
    });

    addComponent({
      filePath: resolve("./runtime/components/amis-render.vue"),
      name: "AmisRender",
      mode: "client",
    });
    addComponent({
      filePath: resolve("./runtime/components/amis-editor.vue"),
      name: "AmisEditor",
      mode: "client",
    });
  },
});
