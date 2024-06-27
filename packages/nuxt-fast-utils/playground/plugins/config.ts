import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-utils:route-meta", (route) => {
      return {
        ...route.meta,
        test: 1,
      };
    });
  },
});
