import { defineNuxtPlugin } from "#app";
import { override } from "#imports";

export default defineNuxtPlugin({
  enforce: "pre",
  async setup(nuxtApp) {
    nuxtApp.hook("fast-route:get-meta", async (route, result) => {
      override(result.value, {
        title: "test",
      });
    });
  },
});
