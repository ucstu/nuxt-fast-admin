import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  enforce: "pre",
  async setup(nuxtApp) {
    nuxtApp.hook("fast-nav:get-history", async (route, history) => {
      Object.assign(history, {
        meta: {
          title: "test 12112121",
        },
      });
    });
  },
});
