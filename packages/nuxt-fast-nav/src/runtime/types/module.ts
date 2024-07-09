import type { RouteLocationNormalizedGeneric } from "#vue-router";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import type { ShallowRef } from "vue-demi";
import type {
  FastNavExtra,
  FastNavHistory,
  FastNavMenu,
  FastNavMenuFilled,
  FastNavPage,
  FastNavPageFilled,
} from "./base";

export interface ModuleOptions {
  /**
   * 检查
   */
  check?: {
    /**
     * 是否开启 menu.parent 检查
     * @default true
     */
    parent?: boolean;
  };
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastNav: ModuleOptionsDefaults;
}

export interface ModuleRuntimeHooks {
  /**
   * 获取菜单列表
   * @param result 结果
   */
  "fast-nav:get-menus": (
    result: ShallowRef<Array<FastNavMenu | FastNavMenuFilled>>
  ) => void;
  /**
   * 获取菜单信息
   * @param input 输入
   * @param result 结果
   */
  "fast-nav:get-menu": (
    input: FastNavMenu,
    result: ShallowRef<FastNavMenuFilled | undefined>
  ) => void;
  /**
   * 获取页面列表
   * @param result 结果
   */
  "fast-nav:get-pages": (
    result: ShallowRef<Array<FastNavPage | FastNavPageFilled>>
  ) => void;
  /**
   * 获取页面信息
   * @param input 输入
   * @param result 结果
   */
  "fast-nav:get-page": (
    input: FastNavPage,
    result: ShallowRef<FastNavPageFilled | undefined>
  ) => void;
  /**
   * 获取历史记录
   * @param to 路由
   * @param result 结果
   */
  "fast-nav:get-history": (
    to: RouteLocationNormalizedGeneric,
    result: ShallowRef<FastNavHistory>
  ) => void;
  /**
   * 路径是否相等
   * @param a a
   * @param b b
   * @param result 结果
   */
  "fast-nav:to-equal": (
    a: FastNavExtra["to"],
    b: FastNavExtra["to"],
    result: ShallowRef<boolean | undefined>
  ) => void;
}
