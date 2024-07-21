import type { NuxtApp } from "#app";
import { FaIcon, NuxtLink } from "#components";
import {
  createNuxtGlobalState,
  getToPath,
  h,
  isNavMenuFilled,
  reactifyEager,
  useNavMenus,
  useNuxtApp,
} from "#imports";
import type {
  FastNavMenuFilled,
  FastNavPageFilled,
} from "@ucstu/nuxt-fast-nav/types";
import type { MenuOption } from "@ucstu/nuxt-naive-ui/exports";

export function getAdminMenu(
  menuOrPage: FastNavMenuFilled | FastNavPageFilled,
  nuxtApp: NuxtApp = useNuxtApp(),
): MenuOption | undefined {
  const menu = menuOrPage as FastNavMenuFilled;
  const page = menuOrPage as FastNavPageFilled;

  const title = isNavMenuFilled(menuOrPage)
    ? menu.title
    : (page.menu?.title ?? page.title);

  const icon = isNavMenuFilled(menuOrPage)
    ? menu.icon
    : (page.menu?.icon ?? page.icon);

  const children = isNavMenuFilled(menuOrPage)
    ? menuOrPage.children
        ?.map((item) => getAdminMenu(item, nuxtApp))
        .filter((item) => item !== undefined)
    : undefined;

  const options: MenuOption = {
    key: isNavMenuFilled(menuOrPage)
      ? menu.to
        ? getToPath(menu.to, nuxtApp)
        : `${menu.parent ? `${menu.parent}-` : ""}${menu.name}`
      : getToPath(page.to, nuxtApp),
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
      return h(FaIcon, { name: icon });
    },
    show: isNavMenuFilled(menuOrPage) ? menu.show : page.menu.show,
    disabled: isNavMenuFilled(menuOrPage) ? menu.disabled : page.menu.disabled,
    children,
  };
  return options;
}

export const useAdminMenu = reactifyEager(getAdminMenu);
export const useAdminMenuGlobal = createNuxtGlobalState(function (
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  return useAdminMenu(useNavMenus(), nuxtApp);
});
