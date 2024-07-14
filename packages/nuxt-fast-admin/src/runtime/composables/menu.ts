import { FaIcon, NuxtLink } from "#components";
import type { FastNavMenuFilled } from "@ucstu/nuxt-fast-nav/types";
import type { MenuOption } from "naive-ui";

function menusToOptions(menu: FastNavMenuFilled): MenuOption | undefined {
  const adminConfig = refAppConfig("fastAdmin");
  const title = menu.key === "$root" ? adminConfig.value.name : menu.title;
  const options: MenuOption = {
    key: isFsNavMenu(menu) ? menu.key : menu.name,
    label() {
      return isFsNavMenu(menu)
        ? title
        : h(
            NuxtLink,
            { to: menu.path },
            {
              default: () => title,
            },
          );
    },
    icon() {
      return h(FaIcon, { name: menu.icon });
    },
    show: isFsNavMenu(menu) ? menu.show : menu.menu.show,
    disabled: isFsNavMenu(menu) ? menu.disabled : menu.menu.disabled,
    children: isFsNavMenu(menu)
      ? (menu.children?.map(menusToOptions).filter(Boolean) as MenuOption[])
      : undefined,
  };
  return adminConfig.value.hooks!.menuOptions
    ? adminConfig.value.hooks!.menuOptions(options)
    : options;
}

export function useMenuOptions(menus: MaybeRefOrGetter<FastNavMenuFilled>) {
  return computed(() => menusToOptions(toValue(menus)));
}
