import { defineNuxtPlugin } from "#app";
import { set } from "lodash-es";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-utils:route-meta", (route, meta) => {
      console.log("fast-utils:route-meta", route, meta);
      set(meta, "foo", "foo");
    });
    nuxtApp.hook("fast-utils:route-meta", (route, meta) => {
      console.log("fast-utils:route-meta", route, meta);
      set(meta, "bar", "bar");
    });
  },
});
