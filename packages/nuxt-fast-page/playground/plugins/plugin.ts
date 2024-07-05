import { defineNuxtPlugin } from "#app";
import { assign } from "lodash-es";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-route:get-meta", (route, result) => {
      assign(result.value, {
        title: "test",
      });
    });
  },
});
