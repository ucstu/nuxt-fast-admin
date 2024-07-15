import { defineNuxtPlugin, type NuxtApp } from "#app";
import { useAppConfig } from "#imports";
import UiElementPlus from "@fast-crud/ui-element";
import ElementPlus from "element-plus";
import { configKey } from "../config";
import { installFsatCrud } from "../utils";

import "element-plus/dist/index.css";

import "@fast-crud/fast-crud/dist/style.css";
import type { ModuleConfigDefaults } from "../types";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const config = useAppConfig()[configKey] as ModuleConfigDefaults;
    nuxtApp.vueApp.use(ElementPlus);
    nuxtApp.vueApp.use(UiElementPlus, config.uiSetupOptions);
    installFsatCrud(nuxtApp as NuxtApp);
  },
});
