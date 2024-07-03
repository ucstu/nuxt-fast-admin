import { defineNuxtPlugin } from "#app";
import { useAppConfig } from "#imports";
import UiNaive from "@fast-crud/ui-naive";
import Naive from "naive-ui";
import { installFsatCrud } from "../utils";

import "@fast-crud/fast-crud/dist/style.css";
import type { FsCrudConfigDefaults } from "../types";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const config = useAppConfig().fastCrud as FsCrudConfigDefaults;
    nuxtApp.vueApp.use(Naive);
    nuxtApp.vueApp.use(UiNaive, config.uiSetupOptions);
    installFsatCrud();
  },
});
