import { readonly, useRoute } from "#imports";
import {
  closeAllPages,
  closeOtherPages,
  closePage,
  useHistories,
} from "./history";
import { useMenus } from "./menu";

export function useNav() {
  const page = useRoute();
  const menus = useMenus();
  const histories = useHistories();
  return {
    page,
    menus,
    histories: readonly(histories),
    closePage,
    closeAllPages,
    closeOtherPages,
  };
}
