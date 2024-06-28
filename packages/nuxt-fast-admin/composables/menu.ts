import { FaIcon, NuxtLink } from "#components";
import type { FsNavMenuOrPage } from "@ucstu/nuxt-fast-nav/types";
import type { MenuOption } from "naive-ui";

function menusToOptions(menus: FsNavMenuOrPage): MenuOption | undefined {
  const adminConfig = refAppConfig("fastAdmin");
  const title = menus.key === "$root" ? adminConfig.value.name : menus.title;
  const options: MenuOption = {
    key: isFsNavMenu(menus) ? menus.key : menus.name,
    label() {
      return isFsNavMenu(menus)
        ? title
        : h(
            NuxtLink,
            { to: menus.path },
            {
              default: () => title,
            },
          );
    },
    icon() {
      return h(FaIcon, { name: menus.icon });
    },
    show: isFsNavMenu(menus) ? menus.show : menus.menu.show,
    disabled: isFsNavMenu(menus) ? menus.disabled : menus.menu.disabled,
    children: isFsNavMenu(menus)
      ? (menus.children?.map(menusToOptions).filter(Boolean) as MenuOption[])
      : undefined,
  };
  return adminConfig.value.hooks!.menuOptions
    ? adminConfig.value.hooks!.menuOptions(options)
    : options;
}

export function useMenuOptions(menus: MaybeRefOrGetter<FsNavMenuOrPage>) {
  return computed(() => menusToOptions(toValue(menus)));
}
