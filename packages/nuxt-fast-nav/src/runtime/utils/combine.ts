import { getToPath, isNavMenuFilled } from "#imports";
import queryString from "query-string";
import type { FastNavMenuFilled, FastNavPageFilled } from "../types";

/**
 * 将页面添加到菜单
 * @param menu 菜单
 * @param page 页面
 */
function addPageToMenu(menu: FastNavMenuFilled, page: FastNavPageFilled) {
  menu.children ??= [];
  menu.children.push(page);
  menu.show ||= menu.children.some((item) =>
    isNavMenuFilled(item) ? item.show : item.menu.show,
  );
}

/**
 * 将页面添加至菜单列表
 * @param page 页面
 * @param current 当前
 * @param root 根
 * @param parents 父级链
 */
export function addPageToMenus(
  page: FastNavPageFilled,
  current: FastNavMenuFilled,
  root: FastNavMenuFilled = current,
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
    console.warn(`[fast-nav] 未找到页面 `, page, ` 的父级菜单`);
    addPageToMenu(root, page);
    return;
  }
  const parent = parents.shift();
  const menu = (current.children as Array<FastNavMenuFilled>).find(
    (menu) => menu.name === parent,
  );
  if (!menu) {
    console.warn(`[fast-nav] 未找到页面 `, page, ` 的父级菜单`);
    addPageToMenu(root, page);
    return;
  }
  if (parents.length) {
    addPageToMenus(page, menu, root, parents);
  } else {
    addPageToMenu(menu, page);
  }
}

/**
 * 排序菜单项目
 * @param menu 菜单
 */
export function sortMenus(menu: FastNavMenuFilled) {
  menu.children?.sort((a, b) => {
    const oa = isNavMenuFilled(a) ? a.order : a.menu.order;
    const ob = isNavMenuFilled(b) ? b.order : b.menu.order;
    return oa - ob;
  });
  menu.children?.forEach((item) => {
    if (isNavMenuFilled(item)) sortMenus(item);
  });
}

/**
 * 填充菜单路由
 * @param menu 菜单
 */
export function fillMenusRoute(
  menu: FastNavMenuFilled,
  pages: Array<FastNavPageFilled>,
) {
  if (menu.to) return;
  const page = pages.find((page) => {
    if (menu.parent !== page.menu.parent) return false;
    const path = getToPath(page.to);
    return (
      path && menu.name === queryString.parseUrl(path).url.split("/").pop()
    );
  });
  menu.to = page?.to;
  menu.children?.forEach((item) => {
    if (isNavMenuFilled(item)) fillMenusRoute(item, pages);
  });
}
