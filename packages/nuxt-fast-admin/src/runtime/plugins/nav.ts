import { defineNuxtPlugin } from "#app";
import { useModuleConfig } from "#imports";
import { configKey } from "../config";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const adminConfig = useModuleConfig(configKey);

    nuxtApp.hook("fast-nav:get-menu", (origin, result) => {
      if (origin.name !== "$root") return;
      result.merge({
        title: adminConfig.value.name,
      });
    });
  },
});
