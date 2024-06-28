import { useHistories } from "./history";
import { useMenus } from "./menu";

export function useNav() {
  const menus = useMenus();
  const histories = useHistories();

  return {
    menus,
    histories,
  };
}
