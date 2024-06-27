import {
  computed,
  isFsNavMenu,
  toValue,
  useFuPageMeta,
  useRouter,
  type MaybeRefOrGetter,
  type Ref,
} from "#imports";
import type { RouteRecordOrLocation } from "@ucstu/nuxt-fast-utils/types";
import type { FsNavMenuWithPages, FsNavPageFilled } from "../types";
import { useMenus } from "./menu";

export function usePage(
  route: MaybeRefOrGetter<RouteRecordOrLocation> = useRouter().currentRoute
) {
  return useFuPageMeta(route) as Readonly<Ref<FsNavPageFilled | undefined>>;
}

export function useParents(
  page: MaybeRefOrGetter<FsNavPageFilled | undefined> = usePage()
) {
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
        (menu) => isFsNavMenu(menu) && menu.key === path
      ) as FsNavMenuWithPages | undefined;
      if (!parent) break;
      parents.push(parent);
      menu = parent;
    }
    return parents;
  });
  return parents;
}
