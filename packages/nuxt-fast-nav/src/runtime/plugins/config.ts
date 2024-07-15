import { defineNuxtPlugin } from "#app";
import { computed, useAppConfig, useRouter } from "#imports";
import { assign, isEqual, pick } from "lodash-es";
import { configKey } from "../config";
import type { ModuleConfigDefaults } from "../types";
import { getMenuFilled, getPageFilled, toEqual } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const router = useRouter();
    const appConfig = useAppConfig();
    const config = computed(() => appConfig[configKey] as ModuleConfigDefaults);

    nuxtApp.hook("fast-nav:get-menus", (result) => {
      result.value.push(...config.value.menus);
    });
    nuxtApp.hook("fast-nav:get-menu", (input, result) => {
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
          to: route,
        });
      });
    });
    nuxtApp.hook("fast-nav:get-page", (input, result) => {
      if (input.type !== "static") return;
      const route = router
        .getRoutes()
        .find((route) => toEqual(route, input.to));
      if (!route) {
        return console.warn(`[fast-nav] 未找到页面 `, input, ` 的路由`);
      }
      const page = getPageFilled(input, route);
      if (!result.value) {
        result.value = page;
        return;
      }
      assign(result.value, page);
    });
    nuxtApp.hook("fast-nav:to-equal", (a, b, result) => {
      const keys = config.value.keys;
      const aObj = typeof a === "string" ? { path: a } : a;
      const bObj = typeof b === "string" ? { path: b } : b;
      result.value =
        aObj && bObj && isEqual(pick(aObj, ...keys), pick(bObj, ...keys));
    });
  },
});
