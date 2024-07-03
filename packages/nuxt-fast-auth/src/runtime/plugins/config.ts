import { defineNuxtPlugin, useAppConfig } from "#app";
import { toRef, type Ref } from "#imports";
import { assign } from "lodash-es";
import type { FsAuthConfigDefaults } from "../types";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const config = toRef(
      useAppConfig(),
      "fastAuth"
    ) as Ref<FsAuthConfigDefaults>;
    nuxtApp.hook("fast-route:get-meta", (path, result) => {
      assign(result.value, config.value.page);
    });
  },
});
