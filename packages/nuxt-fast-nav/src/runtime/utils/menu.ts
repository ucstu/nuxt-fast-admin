import { getFuConfig } from "#imports";
import type { FsNavMenu, FsNavMenuFilled } from "../types";

export function getMenuFilled(
  menu: FsNavMenu
): Omit<FsNavMenuFilled, "children"> {
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
