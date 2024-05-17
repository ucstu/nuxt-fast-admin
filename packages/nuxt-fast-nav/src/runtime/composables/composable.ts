import {
  readonly,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from "#imports";
import type { ReadonlyDeep } from "type-fest";
import type { FsNavMenuWithPages, FsNavPageFilled } from "../types";
import {
  closeAllPages,
  closeOtherPages,
  closePage,
  useHistories,
} from "./history";
import { refreshMenus, useMenus } from "./menu";
import { usePage, useParents } from "./page";

type UseNavRet = {
  /**
   * 菜单
   */
  menus: Ref<FsNavMenuWithPages>;
  /**
   * 刷新菜单
   */
  refreshMenus: typeof refreshMenus;
  /**
   * 页面
   */
  currentPage: ComputedRef<FsNavPageFilled | undefined>;
  /**
   * 使用父级
   */
  useParents: typeof useParents;
  /**
   * 历史
   */
  histories: ReadonlyDeep<Ref<Array<FsNavPageFilled>>>;
  /**
   * 关闭页面
   */
  closePage: (
    page?: MaybeRefOrGetter<
      ReadonlyDeep<FsNavPageFilled> | FsNavPageFilled | undefined
    >,
  ) => Promise<void>;
  /**
   * 关闭所有页面
   */
  closeAllPages: () => Promise<void>;
  /**
   * 关闭其他页面
   */
  closeOtherPages: (
    page?: MaybeRefOrGetter<
      ReadonlyDeep<FsNavPageFilled> | FsNavPageFilled | undefined
    >,
  ) => Promise<void>;
};
export function useNav(): UseNavRet {
  const currentPage = usePage();
  const menus = useMenus();
  const histories = useHistories();
  return {
    menus,
    refreshMenus,
    currentPage,
    useParents,
    histories: readonly(histories),
    closePage,
    closeAllPages,
    closeOtherPages,
  };
}
