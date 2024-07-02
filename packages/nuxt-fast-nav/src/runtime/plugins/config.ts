import { defineNuxtPlugin } from "#app";
import { override } from "#imports";
import { getPageFilled } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  async setup(nuxtApp) {
    nuxtApp.hook("fast-route:get-meta", (route, result) => {
      override(
        result.value,
        getPageFilled({
          to: {
            name: route.name,
            path: route.path,
          },
          children: route.children,
        })
      );
    });
  },
});
