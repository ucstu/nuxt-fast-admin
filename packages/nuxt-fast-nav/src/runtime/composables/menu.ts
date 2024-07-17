import type { NuxtApp } from "#app";
import {
  computed,
  createNuxtGlobalState,
  shallowRef,
  useNuxtApp,
} from "#imports";
import { extendRef, reactify } from "@ucstu/nuxt-fast-utils/exports";
import { cloneDeep } from "lodash-es";
import type {
  FastNavMenu,
  FastNavMenuFilled,
  FastNavPageFilled,
} from "../types";
import {
  addPageToMenus,
  fillMenusRoute,
  isNavMenuFilled,
  sortMenus,
} from "../utils";
import { useNavPages } from "./page";

export function getNavMenus(
  nuxtApp: NuxtApp = useNuxtApp(),
): Array<FastNavMenu | FastNavMenuFilled> {
  const result = shallowRef<Array<FastNavMenu | FastNavMenuFilled>>([]);

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-menus",
    result,
  );

  return result.value;
}

export function getNavMenu(
  menu: FastNavMenu | FastNavMenuFilled,
  parent: string = "",
  nuxtApp: NuxtApp = useNuxtApp(),
): FastNavMenuFilled {
  const result = shallowRef<FastNavMenuFilled>(
    cloneDeep(menu) as FastNavMenuFilled,
  );

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-menu",
    menu,
    result,
  );

  return {
    ...result.value,
    parent,
    children:
      menu.children?.map((item) =>
        "name" in item
          ? getNavMenu(
              item as FastNavMenu,
              `${parent ? `${parent}.` : ""}${menu.name}`,
              nuxtApp,
            )
          : item,
      ) ?? [],
  };
}

export const useNavMenus = createNuxtGlobalState(function (
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  const pages = useNavPages(nuxtApp);

  const result = computed(() => {
    const result = getNavMenu(
      {
        name: "$root",
        children: getNavMenus(nuxtApp),
      } as FastNavMenu,
      "",
      nuxtApp,
    );
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
        (menu) => isNavMenuFilled(menu) && menu.name === path,
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
