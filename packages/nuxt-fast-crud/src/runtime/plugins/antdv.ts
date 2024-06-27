import { defineNuxtPlugin } from "#app";
import { getFuConfig } from "#imports";
import UiAntdv from "@fast-crud/ui-antdv";
import Antdv from "ant-design-vue";
import { installFsatCrud } from "../utils";

import "ant-design-vue/dist/antd.css";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  const config = getFuConfig("fastCrud");
  nuxtApp.vueApp.use(Antdv);
  nuxtApp.vueApp.use(UiAntdv, config.uiSetupOptions ?? {});
  installFsatCrud();
});
