import { isFsNavMenu, useFuPageMetas, useState } from "#imports";
import { computedEager } from "@ucstu/nuxt-fast-utils/exports";
import { clone } from "lodash-es";
import type { FsNavMenuWithPages, FsNavPageFilled } from "../types";
import { _getMenuFilled } from "../utils";

export function _useMenus() {
  return useState<FsNavMenuWithPages>("fast-nav-menus", () =>
    _getMenuFilled({
      key: "$root",
    })
  );
}

function addPageToMenu(menu: FsNavMenuWithPages, page: FsNavPageFilled) {
  menu.children ??= [];
  menu.children.push(page);
  menu.show =
    menu.show === true
      ? true
      : menu.children.some((item) =>
          isFsNavMenu(item) ? item.show : item.menu.show
        );
}

function addPageToMenus(
  page: FsNavPageFilled,
  current: FsNavMenuWithPages,
  root: FsNavMenuWithPages = current,
  parents: Array<string> = page.menu.parent.split(".")
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
      `[fast-nav] 未找到页面 ${page.path} 的父级菜单 ${page.menu.parent}`
    );
    addPageToMenu(root, page);
    return;
  }
  const parent = parents.shift();
  const menu = (current.children as Array<FsNavMenuWithPages>).find(
    (menu) => menu.key === parent
  );
  if (!menu) {
    console.warn(
      `[fast-nav] 未找到页面 ${page.path} 的父级菜单 ${page.menu.parent}`
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

export function useMenus() {
  const _menus = _useMenus();
  const pages = useFuPageMetas();
  console.log(pages.value);

  return computedEager(() => {
    const menus = clone(_menus.value);
    for (const page of pages.value) {
      addPageToMenus(page as FsNavPageFilled, menus);
    }
    sortMenus(menus);
    return menus;
  });
}
