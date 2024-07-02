import type { FsNavMenuFilled, FsNavPageFilled } from "../types";

/**
 * 将页面添加到菜单
 * @param menu 菜单
 * @param page 页面
 */
function addPageToMenu(menu: FsNavMenuFilled, page: FsNavPageFilled) {
  menu.children ??= [];
  menu.children.push(page);
  menu.show ||= menu.children.some((item) =>
    "key" in item ? item.show : item.menu.show
  );
}

/**
 * 将页面添加至菜单列表
 * @param page 页面
 * @param current 当前
 * @param root 根
 * @param parents 父级链
 * @returns
 */
export function addPageToMenus(
  page: FsNavPageFilled,
  current: FsNavMenuFilled,
  root: FsNavMenuFilled = current,
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
    console.warn(`[fast-nav] 未找到页面 `, page, ` 的父级菜单`);
    addPageToMenu(root, page);
    return;
  }
  const parent = parents.shift();
  const menu = (current.children as Array<FsNavMenuFilled>).find(
    (menu) => menu.key === parent
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
export function sortMenus(menu: FsNavMenuFilled) {
  menu.children?.sort((a, b) => {
    const ordera = "key" in a ? a.order : a.menu.order;
    const orderb = "key" in b ? b.order : b.menu.order;
    return ordera - orderb;
  });
  menu.children?.forEach((item) => {
    if ("key" in item) sortMenus(item);
  });
}

/**
 * 填充菜单路由
 * @param menu 菜单
 */
export function fillMenusRoute(
  menu: FsNavMenuFilled,
  pages: Array<FsNavPageFilled>
) {
  if (menu.to) return;
  const page = pages.find(
    (page) =>
      menu.parent === page.menu.parent &&
      menu.key === page.to.path.split("/").pop()
  );
  menu.to = page?.to;
  menu.children?.forEach((item) => {
    if ("key" in item) fillMenusRoute(item, pages);
  });
}
