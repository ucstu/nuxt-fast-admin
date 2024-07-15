import { defineNuxtPlugin, type NuxtApp } from "#app";
import { useAppConfig } from "#imports";
import UiAntdv from "@fast-crud/ui-antdv4";
import Antdv from "ant-design-vue";
import { configKey } from "../config";
import { installFsatCrud } from "../utils";

import "ant-design-vue/dist/reset.css";

import "@fast-crud/fast-crud/dist/style.css";
import "@fast-crud/ui-antdv4/dist/style.css";
import type { ModuleConfigDefaults } from "../types";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const config = useAppConfig()[configKey] as ModuleConfigDefaults;
    nuxtApp.vueApp.use(Antdv);
    nuxtApp.vueApp.use(UiAntdv, config.uiSetupOptions);
    installFsatCrud(nuxtApp as NuxtApp);
  },
});
