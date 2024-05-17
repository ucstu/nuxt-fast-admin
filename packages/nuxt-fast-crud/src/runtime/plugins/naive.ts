import { defineNuxtPlugin } from "#app";
import UiNaive from "@fast-crud/ui-naive";
import Naive from "naive-ui";
import { useAppConfigRef } from "../composables";
import { installFsatCrud } from "../utils";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useAppConfigRef("fastCrud").value;
  nuxtApp.vueApp.use(Naive);
  nuxtApp.vueApp.use(UiNaive, config!.uiSetupOptions ?? {});
  installFsatCrud();
});
