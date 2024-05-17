import { defineNuxtPlugin } from "#app";
import UiAntdv from "@fast-crud/ui-antdv";
import Antdv from "ant-design-vue";
import { useAppConfigRef } from "../composables";
import { installFsatCrud } from "../utils";

import "ant-design-vue/dist/antd.css";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useAppConfigRef("fastCrud").value;
  nuxtApp.vueApp.use(Antdv);
  nuxtApp.vueApp.use(UiAntdv, config!.uiSetupOptions ?? {});
  installFsatCrud();
});
