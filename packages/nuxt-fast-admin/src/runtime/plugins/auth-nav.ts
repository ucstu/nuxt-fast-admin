import { defineNuxtPlugin, type NuxtApp } from "#app";
import { $auth, useRuntimeConfig } from "#imports";
import { configKey } from "../config";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig().public[configKey];

    nuxtApp.hook("fast-nav:get-history", (to, result) => {
      if (
        runtimeConfig.modules.includes("@ucstu/nuxt-fast-auth") &&
        runtimeConfig.features.pages.auth &&
        to.name === "auth"
      ) {
        result.remove();
      }
    });

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
