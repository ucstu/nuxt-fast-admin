import { useAppConfig } from "#imports";
import type { FsNavConfigDefaults, FsNavMenu, FsNavMenuFilled } from "../types";
import { getPageFilled } from "./page";

export function getMenuFilled(
  menu: FsNavMenu,
  parent: string = "",
): FsNavMenuFilled {
  const config = useAppConfig().fastNav as FsNavConfigDefaults;

  return {
    ...menu,
    parent,
    title: menu.title ?? menu.key.toString(),
    icon: menu.icon ?? config.menu.icon,
    desc: menu.desc ?? "",
    show: menu.show ?? config.menu.show,
    disabled: menu.disabled ?? config.menu.disabled,
    order: menu.order ?? config.menu.order,
    children:
      menu.children?.map((item) =>
        "key" in item
          ? getMenuFilled(
              item as FsNavMenu,
              `${parent ? `${parent}.` : ""}${menu.key}`,
            )
          : getPageFilled(item as Parameters<typeof getPageFilled>[0]),
      ) ?? [],
  };
}
