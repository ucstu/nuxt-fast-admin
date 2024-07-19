import { defineNuxtPlugin, type NuxtApp } from "#app";
import { getModuleConfig } from "#imports";
import UiAntdv from "@fast-crud/ui-antdv";
import Antdv from "ant-design-vue";
import { configKey } from "../config";
import { installFsatCrud } from "../utils";

import "ant-design-vue/dist/antd.css";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const crudConfig = getModuleConfig(configKey);
    nuxtApp.vueApp.use(Antdv);
    nuxtApp.vueApp.use(UiAntdv, crudConfig.uiSetupOptions);
    installFsatCrud(nuxtApp as NuxtApp);
  },
});
