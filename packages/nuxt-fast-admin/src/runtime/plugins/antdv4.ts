import { defineNuxtPlugin } from "#app";
import { useAppConfig } from "#imports";
import UiAntdv from "@fast-crud/ui-antdv4";
import Antdv from "ant-design-vue";
import { installFsatCrud } from "../utils";

import "ant-design-vue/dist/reset.css";

import "@fast-crud/fast-crud/dist/style.css";
import "@fast-crud/ui-antdv4/dist/style.css";
import type { FsCrudConfigDefaults } from "../types";

export default defineNuxtPlugin({
  dependsOn: ["@ucstu/nuxt-fast-utils"],
  setup(nuxtApp) {
    const config = useAppConfig().fastCrud as FsCrudConfigDefaults;
    nuxtApp.vueApp.use(Antdv);
    nuxtApp.vueApp.use(UiAntdv, config.uiSetupOptions);
    installFsatCrud();
  },
});