import type { FsNavMenu, FsNavMenuFilled } from "../../module";
import { useAppConfigRef } from "../composables/config";

export function _getMenuFilled(
  menu: FsNavMenu,
): Omit<FsNavMenuFilled, "children"> {
  const config = useAppConfigRef("fastNav").value!;

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
  menu: FsNavMenu,
): Promise<FsNavMenuFilled | undefined> {
  const config = useAppConfigRef("fastNav").value!;

  const menuFilled = {
    ..._getMenuFilled(menu),
    children: (
      await Promise.all(
        menu.children?.map((child) => getMenuFilled(child as FsNavMenu)) ?? [],
      )
    ).filter(Boolean) as Array<FsNavMenuFilled>,
  };

  return config.hooks!.getMenu
    ? await config.hooks!.getMenu(menuFilled)
    : menuFilled;
}
