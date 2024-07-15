import { defineNuxtPlugin } from "#app";
import { addRouteMiddleware, computed, useAppConfig, useHead } from "#imports";
import { configKey } from "../config";
import type { ModuleConfigDefaults } from "../types";

export default defineNuxtPlugin({
  enforce: "pre",
  async setup() {
    const appConfig = useAppConfig();
    const config = computed(() => appConfig[configKey] as ModuleConfigDefaults);

    console.log(1111);

    if (config.value.app.head) {
      addRouteMiddleware((to) => {
        const name = config.value.name;
        const title = to.meta.tab?.title ?? to.meta.title ?? "";
        useHead({
          title: title ? `${title} - ${name}` : name,
        });
      });
    }
  },
});
