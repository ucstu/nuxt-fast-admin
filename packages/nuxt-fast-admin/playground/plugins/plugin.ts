import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    nuxtApp.hook("fast-auth:sign-in", (form, result) => {
      result.value = "token";
    });
  },
});
