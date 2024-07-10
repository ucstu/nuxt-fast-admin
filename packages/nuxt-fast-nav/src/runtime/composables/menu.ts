import {
  computed,
  createNuxtGlobalState,
  shallowRef,
  useNuxtApp,
} from "#imports";
import { extendRef, reactify } from "@ucstu/nuxt-fast-utils/exports";
import type {
  FastNavMenu,
  FastNavMenuFilled,
  FastNavPageFilled,
} from "../types";
import { addPageToMenus, fillMenusRoute, sortMenus } from "../utils";
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

export function getNavMenu(
  menu: FastNavMenu | FastNavMenuFilled,
  parent: string = "",
  nuxtApp = useNuxtApp()
): FastNavMenuFilled {
  const result = shallowRef<FastNavMenuFilled>(menu as FastNavMenuFilled);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-menu",
    menu,
    parent,
    result
  );
  return {
    ...result.value,
    children:
      menu.children?.map((item) =>
        "name" in item
          ? getNavMenu(
              item as FastNavMenu,
              `${parent ? `${parent}.` : ""}${menu.name}`
            )
          : item
      ) ?? [],
  };
}

export const useNavMenus = createNuxtGlobalState(() => {
  const pages = useNavPages();

  const result = computed(() => {
    const result = getNavMenu({
      name: "$root",
      children: getNavMenus(),
    } as FastNavMenu);
    pages.value.forEach((page) => addPageToMenus(page, result));
    fillMenusRoute(result, pages.value);
    sortMenus(result);
    return result;
  });

  /**
   * 获取页面祖辈菜单
   * @param page 页面
   * @returns 祖辈菜单
   */
  function getMenus(page: FastNavPageFilled | undefined = pages.getPage()) {
    const parents: Array<FastNavMenuFilled> = [result.value];

    if (!page || page.menu.parent === "$root") return parents;

    const paths = page.menu.parent.split(".");

    let menu = result.value;
    for (const path of paths) {
      const parent = menu.children?.find(
        (menu) => "name" in menu && menu.name === path
      ) as FastNavMenuFilled | undefined;
      if (!parent) break;
      parents.push(parent);
      menu = parent;
    }

    return parents;
  }

  const useMenus = reactify(getMenus);

  return extendRef(result, {
    current: useMenus(),
    getMenus,
    useMenus,
  });
});
