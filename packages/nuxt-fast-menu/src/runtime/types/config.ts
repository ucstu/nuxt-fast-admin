import type { RouteLocationRaw } from "#vue-router";
import type { LiteralUnion, RequiredDeep } from "@ucstu/nuxt-fast-utils/types";
import type {
  FsNavHistory,
  FsNavMenu,
  FsNavMenuKeys,
  MenuMeta,
  TabMeta,
} from "./base";

export interface FsNavConfig {
  /**
   * 父级菜单
   */
  menus?: Array<FsNavMenu<FsNavMenuKeys>>;
  /**
   * 菜单配置
   */
  menu?: Pick<MenuMeta, "disabled" | "order"> & {
    /**
     * 是否显示
     * @description 是否显示在导航中
     * @default false
     */
    show?: boolean;
    /**
     * 默认菜单图标
     * @default "material-symbols:lists"
     */
    icon?: string;
  };
  /**
   * 页面配置
   */
  page?: {
    /**
     * 默认页面图标
     * @default "material-symbols:pages"
     */
    icon?: string;
    /**
     * 默认菜单配置
     */
    menu?: Pick<MenuMeta, "has" | "show" | "disabled" | "order">;
    /**
     * 默认标签配置
     */
    tab?: Pick<TabMeta, "has" | "show">;
  };
  /**
   * 首页路由
   * @description 用于关闭所有标签时跳转
   * @default "/"
   */
  home?: RouteLocationRaw;
  /**
   * 历史比较字段
   * @description 用于判断历史记录是否相等
   * @default ["hash", "name", "params", "path", "query"]
   */
  keys?: Array<LiteralUnion<keyof FsNavHistory["to"], string>>;
}

export type FsNavConfigDefaults = RequiredDeep<FsNavConfig>;
