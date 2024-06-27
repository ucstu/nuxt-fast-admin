import { callWithNuxt, useRuntimeConfig } from "#app";
import { defineNuxtPlugin, useFuConfig, useRouter } from "#imports";
import { openPage, useMenus } from "../composables";
import type { FsNavPageFilled } from "../types";
import { addPageToMenus, getMenuFilled, sortMenus } from "../utils";

export default defineNuxtPlugin({
  dependsOn: ["@ucstu/nuxt-fast-utils"],
  async setup(nuxtApp) {
    const menus = useMenus();
    const router = useRouter();
    const config = useFuConfig("fastNav");
    const runtimeConfig = useRuntimeConfig();

    router.afterEach((to) => callWithNuxt(nuxtApp, () => openPage(to)));

    // 如果开启了 SSR 并且是客户端环境，则不重复初始化菜单
    if (runtimeConfig.public.fastUtils.ssr && import.meta.client) return;

    if (!config.value.menus) config.value.menus = [];
    await nuxtApp.callHook("fast-nav:menus", config.value.menus);
    menus.value = getMenuFilled({
      key: "$root",
      children: config.value.menus,
    });
    for (const route of router.getRoutes()) {
      addPageToMenus(route.meta as FsNavPageFilled, menus.value);
    }
    sortMenus(menus.value);
  },
});
