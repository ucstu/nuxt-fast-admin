import { defineNuxtPlugin } from "#app";
import { getFuConfig } from "#imports";
import UiNaive from "@fast-crud/ui-naive";
import Naive from "naive-ui";
import { installFsatCrud } from "../utils";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  const config = getFuConfig("fastCrud");
  nuxtApp.vueApp.use(Naive);
  nuxtApp.vueApp.use(UiNaive, config.uiSetupOptions ?? {});
  installFsatCrud();
});
