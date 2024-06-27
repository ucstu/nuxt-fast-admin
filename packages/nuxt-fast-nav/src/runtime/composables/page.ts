import { isFsNavMenu, useRoute } from "#imports";
import type { FsNavMenuWithPages, FsNavPageFilled } from "../types";
import { useMenus } from "./menu";

export function getParents(
  page: FsNavPageFilled = useRoute().meta as FsNavPageFilled
) {
  const menus = useMenus();
  const parents: Array<FsNavMenuWithPages> = [menus.value];
  if (!page || page.menu.parent === "$root") return parents;
  const paths = page.menu.parent.split(".");
  let menu = menus.value;
  for (const path of paths) {
    if (!menu.children) break;
    const parent = menu.children.find(
      (menu) => isFsNavMenu(menu) && menu.key === path
    ) as FsNavMenuWithPages | undefined;
    if (!parent) break;
    parents.push(parent);
    menu = parent;
  }
  return parents;
}
