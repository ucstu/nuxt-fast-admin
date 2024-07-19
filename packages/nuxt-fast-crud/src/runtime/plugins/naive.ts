import { defineNuxtPlugin, type NuxtApp } from "#app";
import { getModuleConfig } from "#imports";
import UiNaive from "@fast-crud/ui-naive";
import Naive from "naive-ui";
import { configKey } from "../config";
import { installFsatCrud } from "../utils";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const crudConfig = getModuleConfig(configKey);
    nuxtApp.vueApp.use(Naive);
    nuxtApp.vueApp.use(UiNaive, crudConfig.uiSetupOptions);
    installFsatCrud(nuxtApp as NuxtApp);
  },
});
