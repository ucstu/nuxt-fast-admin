import type { ResolvedAppConfig } from "#build/types/app.config";
import type { RouteMeta, RouteRecordName } from "#vue-router";
import type { LiteralUnion, RequiredDeep, SetFieldType } from "type-fest";

export interface FsNavConfigOption {}

export interface FsNavMenuKeyOption {}

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
        FsNavConfigOption extends { check: { parent: boolean } }
          ? FsNavConfigOption["check"]["parent"] extends true
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
  RequiredDeep<FsNavPage> &
    RouteMeta & {
      /**
       * 页面名称
       */
      name: RouteRecordName | null | undefined;
      /**
       * 页面路径
       */
      path: string;
    },
  "menu",
  RequiredDeep<
    MenuMeta & {
      parent: string;
    }
  >
>;

/* eslint-disable-next-line @typescript-eslint/ban-types */
export interface FsNavMenu<T extends object = {}, K extends keyof T = keyof T>
  extends Omit<MenuMeta, "has"> {
  key: LiteralUnion<K, string>;
  children?: Array<T[K] extends object ? FsNavMenu<T[K]> : FsNavMenu>;
}

export type FsNavMenuFilled = RequiredDeep<FsNavMenu>;
export interface FsNavMenuWithPages extends Omit<FsNavMenuFilled, "children"> {
  /**
   * 子项目
   */
  children?: Array<FsNavMenuOrPage>;
}
export type FsNavMenuOrPage = FsNavMenuWithPages | FsNavPageFilled;
