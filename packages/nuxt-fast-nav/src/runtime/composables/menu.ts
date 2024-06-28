import { computed, refAppConfig, useRouteMetas } from "#imports";
import {
  createSharedComposable,
  extendRef,
} from "@ucstu/nuxt-fast-utils/exports";
import { cloneDeep } from "lodash-es";
import type { FsNavMenuWithPages, FsNavPageFilled } from "../types";
import {
  addPageToMenus,
  getMenuFilled,
  isFsNavMenu,
  sortMenus,
} from "../utils";

export const useMenus = createSharedComposable(() => {
  const pages = useRouteMetas();
  const config = refAppConfig("fastNav");

  const result = computed(() => {
    const result = getMenuFilled({
      key: "$root",
      children: cloneDeep(config.value.menus),
    }) as FsNavMenuWithPages;
    Object.values(pages.value).forEach((page) => {
      addPageToMenus(page as FsNavPageFilled, result);
    });
    sortMenus(result);
    return result;
  });

  return extendRef(result, {
    findParents(page: FsNavPageFilled) {
      const parents: Array<FsNavMenuWithPages> = [result.value];
      if (!page || page.menu.parent === "$root") return parents;
      const paths = page.menu.parent.split(".");
      let menu = result.value;
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
    },
  });
});
