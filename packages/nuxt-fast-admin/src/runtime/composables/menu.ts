import { FaIcon, NuxtLink } from "#components";
import {
  createNuxtGlobalState,
  getToPath,
  h,
  isNavMenuFilled,
  useNavMenus,
} from "#imports";
import type {
  FastNavMenuFilled,
  FastNavPageFilled,
} from "@ucstu/nuxt-fast-nav/types";
import { reactify } from "@ucstu/nuxt-fast-utils/exports";
import type { MenuOption } from "@ucstu/nuxt-naive-ui/exports";

export function getAdminMenu(
  menuOrPage: FastNavMenuFilled | FastNavPageFilled,
): MenuOption | undefined {
  const menu = menuOrPage as FastNavMenuFilled;
  const page = menuOrPage as FastNavPageFilled;

  const title = isNavMenuFilled(menuOrPage)
    ? menu.title
    : (page.tab.title ?? page.title);

  const children = isNavMenuFilled(menuOrPage)
    ? menuOrPage.children
        ?.map(getAdminMenu)
        .filter((item) => item !== undefined)
    : undefined;

  const options: MenuOption = {
    key: isNavMenuFilled(menuOrPage)
      ? menu.to
        ? getToPath(menu.to)
        : `${menu.parent ? `${menu.parent}-` : ""}${menu.name}`
      : getToPath(page.to),
    label() {
      return menuOrPage.to && menu
        ? h(
            NuxtLink,
            { to: menuOrPage.to },
            {
              default: () => title,
            },
          )
        : title;
    },
    icon() {
      return h(FaIcon, { name: menuOrPage.icon });
    },
    show: isNavMenuFilled(menuOrPage) ? menu.show : page.menu.show,
    disabled: isNavMenuFilled(menuOrPage) ? menu.disabled : page.menu.disabled,
    children,
  };
  return options;
}

export const useAdminMenu = reactify(getAdminMenu);
export const useAdminMenuGlobal = createNuxtGlobalState(function () {
  return useAdminMenu(useNavMenus());
});
