import { getNuxtConfig } from "#imports";
import { configKey } from "../config";
import type { FastNavMenu, FastNavMenuFilled } from "../types";

export function getMenuFilled(
  menu: FastNavMenu | FastNavMenuFilled,
): Omit<FastNavMenuFilled, "children" | "parent"> {
  const config = getNuxtConfig(configKey);

  return {
    name: menu.name,
    title: menu.title ?? menu.name.toString(),
    icon: menu.icon ?? config.menu.icon,
    desc: menu.desc ?? "",
    show: menu.show ?? config.menu.show,
    disabled: menu.disabled ?? config.menu.disabled,
    order: menu.order ?? config.menu.order,
  };
}
