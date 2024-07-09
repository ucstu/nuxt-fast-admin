import { defineNuxtPlugin } from "#app";
import { getNuxtConfig } from "#imports";
import UiElementPlus from "@fast-crud/ui-element";
import ElementPlus from "element-plus";
import { configKey } from "../../config";
import { installFsatCrud } from "../utils";

import "element-plus/dist/index.css";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const config = getNuxtConfig(configKey);
    nuxtApp.vueApp.use(ElementPlus);
    nuxtApp.vueApp.use(UiElementPlus, config.uiSetupOptions);
    installFsatCrud(nuxtApp);
  },
});
