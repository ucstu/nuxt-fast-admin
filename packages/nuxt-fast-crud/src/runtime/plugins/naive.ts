import { defineNuxtPlugin } from "#app";
import { getAppConfig } from "#imports";
import UiNaive from "@fast-crud/ui-naive";
import Naive from "naive-ui";
import { installFsatCrud } from "../utils";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  const config = getAppConfig("fastCrud");
  nuxtApp.vueApp.use(Naive);
  nuxtApp.vueApp.use(UiNaive, config.uiSetupOptions ?? {});
  installFsatCrud();
});
