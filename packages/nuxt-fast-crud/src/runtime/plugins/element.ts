import { defineNuxtPlugin } from "#app";
import { useAppConfig } from "#imports";
import UiElementPlus from "@fast-crud/ui-element";
import ElementPlus from "element-plus";
import { installFsatCrud } from "../utils";

import "element-plus/dist/index.css";

import "@fast-crud/fast-crud/dist/style.css";
import type { FsCrudConfigDefaults } from "../types";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const config = useAppConfig().fastCrud as FsCrudConfigDefaults;
    nuxtApp.vueApp.use(ElementPlus);
    nuxtApp.vueApp.use(UiElementPlus, config.uiSetupOptions);
    installFsatCrud();
  },
});
