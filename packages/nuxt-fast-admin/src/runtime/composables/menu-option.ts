import { FaIcon, NuxtLink } from "#components";
import { createNuxtGlobalState, h, useNavMenus } from "#imports";
import type {
  FastNavMenuFilled,
  FastNavPageFilled,
} from "@ucstu/nuxt-fast-nav/types";
import { reactify } from "@ucstu/nuxt-fast-utils/exports";
import type { MenuOption } from "@ucstu/nuxt-naive-ui/exports";
import { getToPath } from "../utils";

export function getAdminMenuOptions(
  menuOrPage: FastNavMenuFilled | FastNavPageFilled
): MenuOption | undefined {
  const menu = menuOrPage as FastNavMenuFilled;
  const page = menuOrPage as FastNavPageFilled;

  const title =
    "name" in menuOrPage ? menu.title : page.tab.title ?? page.title;

  const options: MenuOption = {
    key:
      "name" in menuOrPage
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
            }
          )
        : title;
    },
    icon() {
      return h(FaIcon, { name: menuOrPage.icon });
    },
    show: "name" in menuOrPage ? menu.show : page.menu.show,
    disabled: "name" in menuOrPage ? menu.disabled : page.menu.disabled,
    children:
      "name" in menuOrPage
        ? menuOrPage.children
            ?.map(getAdminMenuOptions)
            .filter((item) => item !== undefined)
        : undefined,
  };
  return options;
}

export const useAdminMenuOptions = reactify(getAdminMenuOptions);
export const useAdminGlobalMenuOptions = createNuxtGlobalState(function () {
  return useAdminMenuOptions(useNavMenus());
});
