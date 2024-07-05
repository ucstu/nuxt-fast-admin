import { defineNuxtPlugin } from "#app";
import { assign } from "lodash-es";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-nav:get-history", (route, history) => {
      assign(history.value, {
        meta: {},
      });
    });
  },
});
