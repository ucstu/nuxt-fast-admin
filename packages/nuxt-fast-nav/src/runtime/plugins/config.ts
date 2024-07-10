import { defineNuxtPlugin } from "#app";
import { useNuxtConfig, useRouter } from "#imports";
import { assign, isEqual, pick } from "lodash-es";
import { configKey } from "../../config";
import { getMenuFilled, getPageFilled } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const router = useRouter();
    const config = useNuxtConfig(configKey);

    nuxtApp.hook("fast-nav:get-menus", (result) => {
      result.value.push(...config.value.menus);
    });
    nuxtApp.hook("fast-nav:get-menu", (input, parent, result) => {
      if (input.name !== "$root") return;
      const menu = getMenuFilled(input);
      if (!result.value) {
        result.value = menu;
        return;
      }
      assign(result.value, menu);
    });

    nuxtApp.hook("fast-nav:get-pages", (result) => {
      router.getRoutes().forEach((route) => {
        result.value.push({
          type: "static",
          to: {
            path: route.path,
          },
        });
      });
    });
    nuxtApp.hook("fast-nav:get-page", (input, result) => {
      if (input.type !== "static") return;
      const page = getPageFilled(input, {
        to: input.to,
        children: router
          .getRoutes()
          .find((route) => route.path === input.to.path)?.children,
      });
      if (!result.value) {
        result.value = page;
        return;
      }
      assign(result.value, page);
    });

    nuxtApp.hook("fast-nav:to-equal", (a, b, result) => {
      const keys = config.value.keys;
      result.value = a && b && isEqual(pick(a, ...keys), pick(b, ...keys));
    });
  },
});
