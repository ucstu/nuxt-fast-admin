import { useAppConfig } from "#imports";
import { configKey } from "../config";
import type {
  FastNavMenu,
  FastNavMenuFilled,
  ModuleConfigDefaults,
} from "../types";

export function getNavMenuFilled(
  menu: FastNavMenu | FastNavMenuFilled
): Omit<FastNavMenuFilled, "children" | "parent"> {
  const config = useAppConfig()[configKey] as ModuleConfigDefaults;

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
