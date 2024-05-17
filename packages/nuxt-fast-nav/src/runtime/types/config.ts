import type {
  FsNavMenu,
  FsNavMenuFilled,
  FsNavMenuKeyOption,
  FsNavPageFilled,
  MenuMeta,
  TabMeta,
} from "../../module";

export interface FsNavConfig {
  /**
   * 父级菜单
   */
  menus?: Array<FsNavMenu<FsNavMenuKeyOption>>;
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
   * 首页路径
   * @description 用于关闭所有标签时跳转的路径
   * @default "/"
   */
  home?: string;
  /**
   * 钩子函数
   */
  hooks?: {
    /**
     * 获取菜单
     * @param menu 菜单
     * @description key === "$root" 为根菜单
     * @returns 菜单
     */
    getMenu?: (
      menu: FsNavMenuFilled,
    ) => FsNavMenuFilled | undefined | Promise<FsNavMenuFilled | undefined>;
    /**
     * 获取页面
     * @param page 页面
     * @returns 页面
     */
    getPage?: (
      page: FsNavPageFilled,
    ) => FsNavPageFilled | undefined | Promise<FsNavPageFilled | undefined>;
  };
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    fastNav?: FsNavConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    fastNav?: FsNavConfig;
  }
}
