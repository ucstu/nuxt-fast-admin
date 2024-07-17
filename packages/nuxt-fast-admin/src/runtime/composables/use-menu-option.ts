import { FaIcon, NuxtLink } from "#components";
import {
  createNuxtGlobalState,
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
import { authPage, getToPath } from "../utils";

export function getAdminMenuOptions(
  menuOrPage: FastNavMenuFilled | FastNavPageFilled,
): MenuOption | undefined {
  const menu = menuOrPage as FastNavMenuFilled;
  const page = menuOrPage as FastNavPageFilled;

  const title = isNavMenuFilled(menuOrPage)
    ? menu.title
    : (page.tab.title ?? page.title);

  const children = isNavMenuFilled(menuOrPage)
    ? menuOrPage.children
        ?.map(getAdminMenuOptions)
        .filter((item) => item !== undefined)
    : undefined;

  let show = false;
  if (isNavMenuFilled(menuOrPage)) {
    show = menu.show && (children?.some((item) => item?.show) ?? false);
  } else {
    show = page.menu.show && authPage(page);
  }

  const options: MenuOption = {
    key: isNavMenuFilled(menuOrPage)
      ? menu.to
        ? getToPath(menu.to)
        : `${menu.parent ? `${menu.parent}-` : ""}${menu.name}`
      : getToPath(page.to),
    label() {
      return menuOrPage.to
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
    show,
    disabled: isNavMenuFilled(menuOrPage) ? menu.disabled : page.menu.disabled,
    children,
  };
  return options;
}

export const useAdminMenuOptions = reactify(getAdminMenuOptions);
export const useAdminGlobalMenuOptions = createNuxtGlobalState(function () {
  return useAdminMenuOptions(useNavMenus());
});
