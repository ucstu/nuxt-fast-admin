import { defineNuxtPlugin } from "#app";
import { nuxtApp } from "../composables";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(_nuxtApp) {
    nuxtApp.value = _nuxtApp;
  },
});
