import {
  computed,
  createNuxtGlobalState,
  shallowRef,
  useNuxtApp,
  useNuxtConfig,
} from "#imports";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import { configKey } from "../../config";
import type {
  FastNavMenu,
  FastNavMenuFilled,
  FastNavPageFilled,
} from "../types";
import { addPageToMenus } from "../utils";
import { useNavPages } from "./page";

export function getNavMenus(nuxtApp = useNuxtApp()) {
  const result = shallowRef(Array<FastNavMenu | FastNavMenuFilled>());
  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-menus",
    result
  );
  return result.value;
}

type FastNavMenuFilledWithOutChildren = Omit<FastNavMenuFilled, "children">;
export function getNavMenu(
  menu: FastNavMenu,
  nuxtApp = useNuxtApp()
): FastNavMenuFilled {
  const result = shallowRef<FastNavMenuFilled>(menu as FastNavMenuFilled);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-menu",
    menu,
    result
  );
  return {
    ...result.value,
    children:
      menu.children?.map((item) =>
        "key" in item
          ? getNavMenu(
              item as FastNavMenu,
              `${parent ? `${parent}.` : ""}${menu.key}`
            )
          : getNavPage(item as Parameters<typeof getPageFilled>[0])
      ) ?? [],
  };
}

export const useNavMenus = createNuxtGlobalState(() => {
  const pages = useNavPages();
  const config = useNuxtConfig(configKey);

  const result = computed(() => {
    const resutl = getNavMenu({
      key: "$root",
      children: getNavMenus(),
    });
    pages.value.forEach((page) => addPageToMenus(page, menus));
    const filledMenus = menus.map((menu) => getNavMenu(menu));
    return sortedMenus;
  });

  return extendRef(result, {
    findParents(page: FastNavPageFilled) {
      const parents: Array<FastNavMenuFilled> = [result.value];
      if (!page || page.menu.parent === "$root") return parents;
      const paths = page.menu.parent.split(".");
      let menu = result.value;
      for (const path of paths) {
        if (!menu.children) break;
        const parent = menu.children.find(
          (menu) => "key" in menu && menu.key === path
        ) as FastNavMenuFilled | undefined;
        if (!parent) break;
        parents.push(parent);
        menu = parent;
      }
      return parents;
    },
  });
});
