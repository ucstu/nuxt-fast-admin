import { defineNuxtPlugin, type NuxtApp } from "#app";
import { useModuleConfig, useRouter } from "#imports";
import defu from "defu";
import { configKey } from "../config";
import { getNavMenuFilled, getNavPageFilled } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const router = useRouter();
    const navConfig = useModuleConfig(configKey);

    nuxtApp.hook("fast-nav:get-menus", (result) => {
      result.value.push(...navConfig.value.menus);
    });
    nuxtApp.hook("fast-nav:get-menu", (input, result) => {
      result.merge(getNavMenuFilled(input, nuxtApp as NuxtApp));
    });
    nuxtApp.hook("fast-nav:get-pages", (result) => {
      router.getRoutes().forEach((route) => {
        result.value.push(
          defu(
            {
              ...route.meta,
              type: "static",
              to: {
                path: route.path,
              },
            },
            /\/:/.test(route.path) || route.children.length
              ? {
                  menu: {
                    show: false,
                  },
                }
              : {}
          )
        );
      });
    });
    nuxtApp.hook("fast-nav:get-page", (input, result) => {
      if (input.type !== "static") return;
      try {
        result.merge(getNavPageFilled(input, nuxtApp as NuxtApp));
      } catch (e) {
        console.warn(
          `[fast-nav] 解析页面 `,
          input,
          ` 时出错，该页面已被忽略`,
          e
        );
        result.remove();
      }
    });
  },
});
