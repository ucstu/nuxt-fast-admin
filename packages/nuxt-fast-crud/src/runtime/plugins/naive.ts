import { defineNuxtPlugin } from "#app";
import { getNuxtConfig } from "#imports";
import UiNaive from "@fast-crud/ui-naive";
import Naive from "naive-ui";
import { configKey } from "../../config";
import { installFsatCrud } from "../utils";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const config = getNuxtConfig(configKey);
    nuxtApp.vueApp.use(Naive);
    nuxtApp.vueApp.use(UiNaive, config.uiSetupOptions);
    installFsatCrud(nuxtApp);
  },
});
