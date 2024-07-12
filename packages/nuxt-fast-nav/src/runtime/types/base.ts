import type { ResolvedAppConfig } from "#build/types/app.config";
import type { RouteLocationRaw } from "#vue-router";
import type {
  LiteralUnion,
  OverrideProperties,
  RequiredDeep,
} from "@ucstu/nuxt-fast-utils/exports";

export interface FastNavOptions {}

export interface FastNavMenuKeys {}

export interface FastNavExtra {
  to?: RouteLocationRaw;
}

type KeysDeep<
  M extends Array<FastNavMenu>,
  P extends string = "",
  I extends number = 30,
  IA extends number[] = [],
  D extends number = 10,
  DA extends number[] = [],
> = M["length"] extends IA["length"]
  ? never
  : I extends IA["length"]
    ? never
    : // 自身
      | `${P}${Exclude<M[IA["length"]]["name"], symbol>}`
        // 子级
        | (M[IA["length"]]["children"] extends Array<FastNavMenu>
            ? DA["length"] extends D
              ? never
              : KeysDeep<
                  M[IA["length"]]["children"],
                  `${P}${Exclude<M[IA["length"]]["name"], symbol>}.`,
                  I,
                  [],
                  D,
                  [0, ...DA]
                >
            : never)
        // 下一个
        | KeysDeep<M, P, I, [0, ...IA], D, []>;

export interface BaseMeta {
  /**
   * 标题
   * @default 路由名称
   */
  title?: string;
  /**
   * 图标
   * @default 模块配置
   */
  icon?: string;
  /**
   * 描述
   * @default ''
   */
  desc?: string;
}

export interface MenuMeta extends BaseMeta {
  /**
   * 导航有无
   * @description 是否显示导航
   * @default true
   */
  has?: boolean;
  /**
   * 是否显示
   * @description 是否显示在导航中
   * @default true
   */
  show?: boolean;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 导航排序
   * @default 0
   */
  order?: number;
}

export interface TabMeta extends BaseMeta {
  /**
   * 标签有无
   * @description 是否显示标签
   * @default true
   */
  has?: boolean;
  /**
   * 是否显示
   * @description 是否显示在标签中
   * @default true
   */
  show?: boolean;
}

interface MenuMetaParent {
  /**
   * 父级菜单
   * @default 文件所在目录
   * @description $root 为根级菜单
   */
  parent?:
    | "$root"
    | LiteralUnion<
        FastNavOptions extends { check: { parent: boolean } }
          ? FastNavOptions["check"]["parent"] extends true
            ? ResolvedAppConfig["fastNav"] extends { menus: Array<FastNavMenu> }
              ? KeysDeep<ResolvedAppConfig["fastNav"]["menus"]>
              : string
            : string
          : string,
        string
      >;
}

// #region 页面
/**
 * 导航页面
 */
export interface FastNavPage extends BaseMeta, Required<FastNavExtra> {
  /**
   * 页面类型
   */
  type: LiteralUnion<"static", string>;
  /**
   * 菜单配置
   */
  menu?: MenuMeta & MenuMetaParent;
  /**
   * 标签配置
   */
  tab?: TabMeta;
}

/**
 * 导航页面（已填充）
 */
export type FastNavPageFilled = RequiredDeep<
  Omit<FastNavPage, keyof FastNavExtra>
> &
  Required<FastNavExtra>;
// #endregion

// #region 菜单
/**
 * 导航菜单
 */
export interface FastNavMenu<
  T extends object = object,
  N extends keyof T = keyof T,
> extends Omit<MenuMeta, "has">,
    FastNavExtra {
  /**
   * 唯一名称
   */
  name: LiteralUnion<N, string>;
  /**
   * 子项目
   */
  children?: Array<T[N] extends object ? FastNavMenu<T[N]> : FastNavMenu>;
}

/**
 * 导航菜单（已填充）
 */
export type FastNavMenuFilled = OverrideProperties<
  RequiredDeep<Omit<FastNavMenu, keyof FastNavExtra>>,
  {
    children: Array<FastNavMenuFilled | FastNavPageFilled>;
  }
> &
  FastNavExtra & {
    /**
     * 父级菜单
     */
    parent: string;
  };
// #endregion

// #region 历史
/**
 * 导航历史
 */
export interface FastNavHistory extends Required<FastNavExtra> {
  /**
   * 元数据
   */
  meta?: BaseMeta & {
    /**
     * 标签配置
     */
    tab?: TabMeta;
  };
}

/**
 * 导航历史（已填充）
 */
export type FastNavHistoryFilled = RequiredDeep<
  Omit<FastNavHistory, keyof FastNavExtra>
> &
  Required<FastNavExtra>;
// #endregion
