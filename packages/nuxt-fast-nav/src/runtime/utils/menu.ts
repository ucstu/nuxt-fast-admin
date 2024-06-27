import { fuHooks, getFuConfig } from "#imports";
import type { FsNavMenu, FsNavMenuFilled } from "../types";

export function _getMenuFilled(menu: FsNavMenu): Omit<FsNavMenuFilled, "children"> {
  const config = getFuConfig("fastNav");

  const title = menu.title ?? menu.key.toString();
  const icon = menu.icon ?? config.menu!.icon!;
  const desc = menu.desc ?? "";

  return {
    ...menu,
    title,
    icon,
    desc,
    key: menu.key,
    show: menu.show ?? config.menu!.show!,
    disabled: menu.disabled ?? config.menu!.disabled!,
    order: menu.order ?? config.menu!.order!,
  };
}

export async function getMenuFilled(
  menu: FsNavMenu
): Promise<FsNavMenuFilled | undefined> {
  const menuFilled: FsNavMenuFilled = {
    ..._getMenuFilled(menu),
    children: (
      await Promise.all(
        menu.children?.map((child) => getMenuFilled(child as FsNavMenu)) ?? []
      )
    ).filter(Boolean) as Array<FsNavMenuFilled>,
  };

  return fuHooks.hookExists("fast-nav:menu-fill")
    ? await fuHooks.callHookSync("fast-nav:menu-fill", menuFilled)
    : menuFilled;
}
