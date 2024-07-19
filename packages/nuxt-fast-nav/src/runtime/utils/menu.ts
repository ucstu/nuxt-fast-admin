import type { NuxtApp } from "#app";
import { getModuleConfig, useNuxtApp } from "#imports";
import { configKey } from "../config";
import type { FastNavMenu, FastNavMenuFilled } from "../types";

export function getNavMenuFilled(
  menu: FastNavMenu | FastNavMenuFilled,
  nuxtApp: NuxtApp = useNuxtApp(),
): Omit<FastNavMenuFilled, "children" | "parent"> {
  const navConfig = getModuleConfig(configKey, nuxtApp);

  return {
    name: menu.name,
    title: menu.title ?? menu.name.toString(),
    icon: menu.icon ?? navConfig.menu.icon,
    desc: menu.desc ?? "",
    show: menu.show ?? navConfig.menu.show,
    disabled: menu.disabled ?? navConfig.menu.disabled,
    order: menu.order ?? navConfig.menu.order,
  };
}
