import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-nav:get-history", (route, history) => {
      history.merge({});
    });
  },
});
