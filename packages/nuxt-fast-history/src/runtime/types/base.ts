import type { ResolvedAppConfig } from "#build/types/app.config";
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from "#vue-router";
import type {
  LiteralUnion,
  RequiredDeep,
  SetFieldType,
  SetOptional,
  SetRequired,
} from "@ucstu/nuxt-fast-utils/types";

export interface FsNavOptions {}

export interface FsNavMenuKeys {}

export interface FsNavExtra {
  to?: SetRequired<
    RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
    "path"
  >;
}

type KeysDeep<
  M extends Array<FsNavMenu>,
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
      | `${P}${Exclude<M[IA["length"]]["key"], symbol>}`
        // 子级
        | (M[IA["length"]]["children"] extends Array<FsNavMenu>
            ? DA["length"] extends D
              ? never
              : KeysDeep<
                  M[IA["length"]]["children"],
                  `${P}${Exclude<M[IA["length"]]["key"], symbol>}.`,
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
        FsNavOptions extends { check: { parent: boolean } }
          ? FsNavOptions["check"]["parent"] extends true
            ? ResolvedAppConfig["fastNav"] extends { menus: Array<FsNavMenu> }
              ? KeysDeep<ResolvedAppConfig["fastNav"]["menus"]>
              : string
            : string
          : string,
        string
      >;
}

export interface FsNavPage extends BaseMeta {
  /**
   * 菜单配置
   */
  menu?: MenuMeta & MenuMetaParent;
  /**
   * 标签配置
   */
  tab?: TabMeta;
}

export type FsNavPageFilled = SetFieldType<
  RequiredDeep<FsNavPage>,
  "menu",
  RequiredDeep<
    MenuMeta & {
      parent: string;
    }
  >
> &
  Required<FsNavExtra>;

/* eslint-disable-next-line @typescript-eslint/ban-types */
export interface FsNavMenu<T extends object = {}, K extends keyof T = keyof T>
  extends Omit<MenuMeta, "has">,
    FsNavExtra {
  /**
   * 唯一键名
   */
  key: LiteralUnion<K, string>;
  /**
   * 子项目
   */
  children?: Array<
    | (T[K] extends object ? FsNavMenu<T[K]> : FsNavMenu)
    | (FsNavPage & Required<FsNavExtra>)
  >;
}

export type FsNavMenuFilled = SetFieldType<
  SetOptional<Required<FsNavMenu>, keyof FsNavExtra>,
  "children",
  Array<FsNavMenuFilled | FsNavPageFilled>
> & {
  /**
   * 父级菜单
   */
  parent: string;
};

export interface FsNavHistory extends Required<FsNavExtra> {
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
