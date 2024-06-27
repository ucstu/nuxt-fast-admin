import { readonly } from "#imports";
import {
  closeAllPages,
  closeOtherPages,
  closePage,
  useHistories,
} from "./history";
import { useMenus } from "./menu";
import { usePage, useParents } from "./page";

export function useNav() {
  const page = usePage();
  const menus = useMenus();
  const histories = useHistories();
  return {
    page,
    menus,
    histories: readonly(histories),
    useParents,
    closePage,
    closeAllPages,
    closeOtherPages,
  };
}
