import {
  computed,
  isFsNavMenu,
  isFsNavPage,
  toValue,
  useRouter,
  type ComputedRef,
  type MaybeRefOrGetter,
} from "#imports";
import type { RouteLocationNormalized } from "#vue-router";
import type { FsNavMenuWithPages, FsNavPageFilled } from "../types";
import { _getPageFilled } from "../utils";
import { useMenus } from "./menu";

function findPageFromMenu(
  route: RouteLocationNormalized,
  menu: FsNavMenuWithPages,
): FsNavPageFilled | undefined {
  return menu.children?.find(
    (page) => isFsNavPage(page) && page.name === route.name,
  ) as FsNavPageFilled | undefined;
}

function findPageFromMenus(
  route: RouteLocationNormalized,
  menus: FsNavMenuWithPages,
  root: FsNavMenuWithPages = menus,
  parents: Array<string> = _getPageFilled(route).menu.parent.split("."),
): FsNavPageFilled | undefined {
  const parent = parents.shift();
  if (parent === "$root") return findPageFromMenu(route, root);
  const menu = menus.children?.find(
    (menu) => isFsNavMenu(menu) && menu.key === parent,
  ) as FsNavMenuWithPages | undefined;
  if (!menu) {
    console.warn(
      `[fast-nav] 未找到页面 ${route.path} 的父级菜单 ${
        _getPageFilled(route).menu.parent
      }`,
    );
    return findPageFromMenu(route, root);
  }
  if (parents.length) {
    return findPageFromMenus(route, menu, root, parents);
  }
  return findPageFromMenu(route, menu);
}

export function usePage(
  route: MaybeRefOrGetter<RouteLocationNormalized> = useRouter().currentRoute,
): ComputedRef<FsNavPageFilled | undefined> {
  const menus = useMenus();
  return computed(() => findPageFromMenus(toValue(route), menus.value));
}

export function useParents(
  page: MaybeRefOrGetter<FsNavPageFilled | undefined> = usePage(),
): ComputedRef<Array<FsNavMenuWithPages>> {
  const menus = useMenus();
  const parents = computed(() => {
    const _page = toValue(page);
    const parents: Array<FsNavMenuWithPages> = [menus.value];
    if (!_page || _page.menu.parent === "$root") return parents;
    const paths = _page.menu.parent.split(".");
    let menu = menus.value;
    for (const path of paths) {
      if (!menu.children) break;
      const parent = menu.children.find(
        (menu) => isFsNavMenu(menu) && menu.key === path,
      ) as FsNavMenuWithPages | undefined;
      if (!parent) break;
      parents.push(parent);
      menu = parent;
    }
    return parents;
  });
  return parents;
}
