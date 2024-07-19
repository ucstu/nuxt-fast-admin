import { defineNuxtPlugin, type NuxtApp } from "#app";
import { toEqual, useModuleConfig, useRuntimeConfig } from "#imports";
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
        toEqual(to, "/crud/:api()/:name()")
      ) {
        const title = `CRUD ${to.params.api}/${to.params.name}`;
        result.merge({
          meta: {
            title,
            tab: { title },
          },
        });
      }
    });

    nuxtApp.hook("fast-nav:get-menu", (input, result) => {
      if (input.name !== "$root") return;
      result.merge({
        title: adminConfig.value.name,
      });
    });

    nuxtApp.hook("fast-nav:get-page", (input, result) => {
      const show = $auth(nuxtApp as NuxtApp, input);
      result.merge({
        menu: { show: result.value?.menu?.show && show },
        tab: {
          show: result.value?.tab?.show && show,
        },
      });
    });
  },
});
