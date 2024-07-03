import type { NuxtApp } from "#app";
import { defineNuxtPlugin } from "#imports";
import { nuxtApp as nuxtAppRef } from "../composables";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtAppRef.value = nuxtApp as NuxtApp;
  },
});
