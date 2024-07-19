import type { RouteLocationNormalizedGeneric } from "#vue-router";
import { type RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import type { ShallowRef } from "vue-demi";
import type {
  FastNavHistory,
  FastNavMenu,
  FastNavMenuFilled,
  FastNavPage,
  FastNavPageFilled,
} from "./base";

export interface ModuleOptions {
  /**
   * 功能开关
   */
  features?: {
    /**
     * 类型检查
     */
    check?: {
      /**
       * parent 检查
       * @default true
       */
      parent?: boolean;
    };
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
    result: ShallowRef<Array<FastNavMenu | FastNavMenuFilled>>,
  ) => void;
  /**
   * 获取菜单信息
   * @param origin 原始
   * @param result 结果
   */
  "fast-nav:get-menu": (
    origin: FastNavMenu | FastNavMenuFilled,
    result: ShallowRef<
      Omit<FastNavMenuFilled, "children" | "parent"> | undefined
    > & {
      remove(): void;
      merge(
        value: Partial<
          Omit<FastNavMenu | FastNavMenuFilled, "children" | "parent">
        >,
        order?: "before" | "after",
      ): void;
    },
  ) => void;
  /**
   * 获取页面列表
   * @param result 结果
   */
  "fast-nav:get-pages": (
    result: ShallowRef<Array<FastNavPage | FastNavPageFilled>>,
  ) => void;
  /**
   * 获取页面信息
   * @param origin 原始
   * @param result 结果
   */
  "fast-nav:get-page": (
    origin: FastNavPage | FastNavPageFilled,
    result: ShallowRef<FastNavPageFilled | undefined> & {
      remove(): void;
      merge(
        value: Partial<FastNavPage | FastNavPageFilled>,
        order?: "before" | "after",
      ): void;
    },
  ) => void;
  /**
   * 获取历史记录
   * @param to 路由
   * @param result 结果
   */
  "fast-nav:get-history": (
    to: RouteLocationNormalizedGeneric,
    result: ShallowRef<FastNavHistory | undefined> & {
      remove(): void;
      merge(value: Partial<FastNavHistory>, order?: "before" | "after"): void;
    },
  ) => void;
}
