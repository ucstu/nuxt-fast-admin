import { useAppConfig } from "#imports";
import type {
  FastNavMenu,
  FastNavMenuFilled,
  ModuleConfigDefaults,
} from "../types";

export function getMenuFilled(
  menu: FastNavMenu,
  parent: string = ""
): FastNavMenuFilled {
  const config = useAppConfig().fastNav as ModuleConfigDefaults;

  return {
    ...menu,
    parent,
    title: menu.title ?? menu.key.toString(),
    icon: menu.icon ?? config.menu.icon,
    desc: menu.desc ?? "",
    show: menu.show ?? config.menu.show,
    disabled: menu.disabled ?? config.menu.disabled,
    order: menu.order ?? config.menu.order,
  };
}
