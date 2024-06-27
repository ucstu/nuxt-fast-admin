import { callWithNuxt } from "#app";
import { defineNuxtPlugin, useFuConfig, useRouter } from "#imports";
import { _useMenus, openPage } from "../composables";
import type { FsNavMenuWithPages } from "../types";
import { getMenuFilled } from "../utils";

export default defineNuxtPlugin({
  async setup(nuxtApp) {
    const _menus = _useMenus();
    const router = useRouter();
    const config = useFuConfig("fastNav");
    router.afterEach((to) => callWithNuxt(nuxtApp, () => openPage(to)));
    console.log("config.value.menus", config.value.menus);

    _menus.value ||= (await getMenuFilled({
      key: "$root",
      children: config.value.menus,
    })) as FsNavMenuWithPages;
  },
});
