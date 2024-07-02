import { defineNuxtPlugin } from "#app";
import { override } from "#imports";

export default defineNuxtPlugin({
  enforce: "pre",
  async setup(nuxtApp) {
    nuxtApp.hook("fast-nav:get-history", async (route, history) => {
      override(history.value, {
        meta: {},
      });
    });
  },
});
