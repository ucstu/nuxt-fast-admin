import { callWithNuxt } from "#app";
import {
  isFsNavMenu,
  useAppConfig,
  useNuxtApp,
  useRouter,
  useState,
  type Ref,
} from "#imports";
import type { FsNavMenu, FsNavMenuWithPages, FsNavPageFilled } from "../types";
import { _getMenuFilled, getMenuFilled, getPageFilled } from "../utils";

/**
 * 使用菜单
 * @returns 菜单
 */
export const useMenus = (): Ref<FsNavMenuWithPages> =>
  useState<FsNavMenuWithPages>("fast-nav-menus", () =>
    _getMenuFilled({
      key: "$root",
    }),
  );

function addPageToMenu(menu: FsNavMenuWithPages, page: FsNavPageFilled) {
  menu.children ??= [];
  menu.children.push(page);
  menu.show =
    menu.show === true
      ? true
      : menu.children.some((item) =>
          isFsNavMenu(item) ? item.show : item.menu.show,
        );
}

function addPageToMenus(
  page: FsNavPageFilled,
  current: FsNavMenuWithPages,
  root: FsNavMenuWithPages = current,
  parents: Array<string> = page.menu.parent.split("."),
) {
  // 如果 parent 为 $root
  if (page.menu.parent === "$root") {
    addPageToMenu(root, page);
    return;
  }
  // 如果 parent 非 $root
  // 如果 children 链 或者 parents 链 到头
  if (!current.children?.length || !parents.length) {
    console.warn(
      `[fast-nav] 未找到页面 ${page.path} 的父级菜单 ${page.menu.parent}`,
    );
    addPageToMenu(root, page);
    return;
  }
  const parent = parents.shift();
  const menu = (current.children as Array<FsNavMenuWithPages>).find(
    (menu) => menu.key === parent,
  );
  if (!menu) {
    console.warn(
      `[fast-nav] 未找到页面 ${page.path} 的父级菜单 ${page.menu.parent}`,
    );
    addPageToMenu(root, page);
    return;
  }
  if (parents.length) {
    addPageToMenus(page, menu, root, parents);
  } else {
    addPageToMenu(menu, page);
  }
}

function sortMenus(menu: FsNavMenuWithPages) {
  menu.children?.sort((a, b) => {
    const ordera = isFsNavMenu(a) ? a.order : a.menu.order;
    const orderb = isFsNavMenu(b) ? b.order : b.menu.order;
    return ordera - orderb;
  });
  menu.children?.forEach((item) => {
    if (isFsNavMenu(item)) sortMenus(item);
  });
}

export async function refreshMenus() {
  const nuxtApp = useNuxtApp();
  const router = useRouter();
  const menus = useMenus();

  const { fastNav = {} } = useAppConfig() as {
    fastNav?: { menus?: Array<FsNavMenu> };
  };
  const _menus = (await getMenuFilled({
    key: "$root",
    children: fastNav.menus,
  })) as FsNavMenuWithPages;
  for (const route of router.getRoutes()) {
    const page = await callWithNuxt(nuxtApp, () => getPageFilled(route));
    if (!page || !page.name) continue;
    addPageToMenus(page, _menus);
  }
  sortMenus(_menus);
  menus.value = _menus;
}
