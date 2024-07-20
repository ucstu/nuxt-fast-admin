import { defineNuxtPlugin, type NuxtApp } from "#app";
import { $auth } from "#imports";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-nav:get-page", (origin, result) => {
      const show = $auth(nuxtApp as NuxtApp, origin);
      result.merge({
        menu: { show: (result.value?.menu?.show && show) ?? true },
        tab: {
          show: (result.value?.tab?.show && show) ?? true,
        },
      });
    });
  },
});
