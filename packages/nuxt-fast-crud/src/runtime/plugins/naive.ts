import { defineNuxtPlugin, type NuxtApp } from "#app";
import { useAppConfig } from "#imports";
import UiNaive from "@fast-crud/ui-naive";
import Naive from "naive-ui";
import { configKey } from "../config";
import { installFsatCrud } from "../utils";

import "@fast-crud/fast-crud/dist/style.css";
import type { ModuleConfigDefaults } from "../types";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const config = useAppConfig()[configKey] as ModuleConfigDefaults;
    nuxtApp.vueApp.use(Naive);
    nuxtApp.vueApp.use(UiNaive, config.uiSetupOptions);
    installFsatCrud(nuxtApp as NuxtApp);
  },
});
