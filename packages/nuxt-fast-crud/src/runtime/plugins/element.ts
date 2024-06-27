import { defineNuxtPlugin } from "#app";
import { getFuConfig } from "#imports";
import UiElementPlus from "@fast-crud/ui-element";
import ElementPlus from "element-plus";
import { installFsatCrud } from "../utils";

import "element-plus/dist/index.css";

import "@fast-crud/fast-crud/dist/style.css";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = getFuConfig("fastCrud");
  nuxtApp.vueApp.use(ElementPlus);
  nuxtApp.vueApp.use(UiElementPlus, config.uiSetupOptions ?? {});
  installFsatCrud();
});
