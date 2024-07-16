import { defineNuxtPlugin } from "#app";
import { computed, useAppConfig } from "#imports";
import type { FastNavMenuFilled } from "@ucstu/nuxt-fast-nav/types";
import type { ModuleConfigDefaults } from "../types";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const appConfig = useAppConfig();
    const adminConfig = computed(
      () => appConfig.fastAdmin as ModuleConfigDefaults
    );
    nuxtApp.hook("fast-admin:get-app-head-title", (input, result) => {
      result.value = input?.title
        ? `${input.title} - ${adminConfig.value.name}`
        : adminConfig.value.name;
    });
    nuxtApp.hook("fast-nav:get-menu", (input, result) => {
      if (input.name !== "$root") return;
      if (!result.value) result.value = input as FastNavMenuFilled;
      result.value.title = adminConfig.value.name;
    });
  },
});
