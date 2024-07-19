import {
  addComponent,
  addPlugin,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { name, version } from "../package.json";
import { configKey, defaults, initModule } from "./runtime/config";
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
