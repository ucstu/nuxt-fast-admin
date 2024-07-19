import { defineNuxtPlugin, type NuxtApp } from "#app";
import { useModuleConfig, useRuntimeConfig } from "#imports";
import { configKey } from "../config";
import { $auth } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const adminConfig = useModuleConfig(configKey);
    const runtimeConfig = useRuntimeConfig().public[configKey];

    nuxtApp.hook("fast-nav:get-history", (to, result) => {
      if (
        runtimeConfig.modules.includes("@ucstu/nuxt-fast-auth") &&
        to.name === "auth"
      ) {
        result.remove();
      }
      if (
        runtimeConfig.modules.includes("@ucstu/nuxt-fast-crud") &&
        runtimeConfig.modules.includes("@ucstu/nuxt-fast-fetch") &&
        to.path.startsWith("/crud/")
      ) {
        const title = `CRUD ${to.params.api}/${to.params.name}`;
        result.merge({
          title,
        });
      }
    });

    nuxtApp.hook("fast-nav:get-menu", (origin, result) => {
      if (origin.name !== "$root") return;
      result.merge({
        title: adminConfig.value.name,
      });
    });

    nuxtApp.hook("fast-nav:get-page", (origin, result) => {
      const show = $auth(nuxtApp as NuxtApp, origin);
      result.merge({
        menu: { show: result.value?.menu?.show && show },
        tab: {
          show: result.value?.tab?.show && show,
        },
      });
    });
  },
});
