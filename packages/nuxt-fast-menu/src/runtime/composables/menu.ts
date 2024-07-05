import {
  computedEager,
  toRef,
  useAppConfig,
  useSafeNuxtApp,
  useRouteMetas,
  type Ref,
} from "#imports";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import { cloneDeep } from "lodash-es";
import type {
  FsNavConfigDefaults,
  FsNavMenuFilled,
  FsNavPageFilled,
} from "../types";
import {
  addPageToMenus,
  fillMenusRoute,
  getMenuFilled,
  sortMenus,
} from "../utils";

export function createNavMenus() {
  const pages = useRouteMetas<FsNavPageFilled>();
  const config = toRef(useAppConfig(), "fastNav") as Ref<FsNavConfigDefaults>;

  const result = computedEager(() => {
    const result = getMenuFilled({
      key: "$root",
      children: cloneDeep(config.value.menus),
    });
    Object.values(pages.value).forEach((page) => {
      addPageToMenus(page, result);
    });
    sortMenus(result);
    fillMenusRoute(result, Object.values(pages.value));
    return result;
  });

  function findParents(page: FsNavPageFilled) {
    const parents: Array<FsNavMenuFilled> = [result.value];
    if (!page || page.menu.parent === "$root") return parents;
    const paths = page.menu.parent.split(".");
    let menu = result.value;
    for (const path of paths) {
      if (!menu.children) break;
      const parent = menu.children.find(
        (menu) => "key" in menu && menu.key === path
      ) as FsNavMenuFilled | undefined;
      if (!parent) break;
      parents.push(parent);
      menu = parent;
    }
    return parents;
  }

  const current = computedEager(() => {});

  return extendRef(result, {
    current,
    findParents,
  });
}

export function useNavMenus(nuxtApp = useSafeNuxtApp()) {
  return nuxtApp.$fastNav.menus as ReturnType<typeof createNavMenus>;
}
