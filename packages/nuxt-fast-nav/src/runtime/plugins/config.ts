import { defineNuxtPlugin } from "#app";
import { useNuxtConfig, useRouter } from "#imports";
import { isEqual, pick } from "lodash-es";
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
    nuxtApp.hook("fast-nav:get-menu", (input, result) => {
      if (input.key !== "$root") return;
      result.value = getMenuFilled(input);
    });
    nuxtApp.hook("fast-nav:get-pages", (result) => {
      router.getRoutes().forEach((route) => {
        result.value.push(
          getPageFilled({
            to: { path: route.path },
            children: route.children,
          })
        );
      });
    });
    nuxtApp.hook("fast-nav:to-equal", (a, b, result) => {
      const keys = config.value.keys;
      result.value = a && b && isEqual(pick(a, ...keys), pick(b, ...keys));
    });
  },
});
