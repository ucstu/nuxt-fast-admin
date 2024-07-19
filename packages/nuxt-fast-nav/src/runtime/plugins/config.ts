import { defineNuxtPlugin, type NuxtApp } from "#app";
import { toRaw, useModuleConfig, useRouter } from "#imports";
import defu from "defu";
import { configKey } from "../config";
import type { FastNavMenuFilled, FastNavPageFilled } from "../types";
import { getNavMenuFilled, getNavPageFilled } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const router = useRouter();
    const navConfig = useModuleConfig(configKey);

    nuxtApp.hook("fast-nav:get-menus", (result) => {
      result.value.push(...navConfig.value.menus);
    });
    nuxtApp.hook("fast-nav:get-menu", (origin, result) => {
      result.value ??= origin as FastNavMenuFilled;
      result.merge(getNavMenuFilled(result.value, nuxtApp as NuxtApp));
    });
    nuxtApp.hook("fast-nav:get-pages", (result) => {
      toRaw(router)
        .getRoutes()
        .forEach((route) => {
          if (/\/:/.test(route.path)) return;
          result.value.push(
            defu(
              {
                ...route.meta,
                type: "static",
                to: {
                  path: route.path,
                  name: route.name,
                },
              },
              route.children.length
                ? {
                    menu: {
                      show: false,
                    },
                  }
                : {},
            ),
          );
        });
    });
    nuxtApp.hook("fast-nav:get-page", (origin, result) => {
      if (origin.type !== "static") return;
      try {
        result.value ??= origin as FastNavPageFilled;
        result.merge(getNavPageFilled(result.value, nuxtApp as NuxtApp));
      } catch (e) {
        console.warn(
          `[fast-nav] 解析页面 `,
          origin,
          ` 时出错，该页面已被忽略`,
          e,
        );
        result.remove();
      }
    });
  },
});
