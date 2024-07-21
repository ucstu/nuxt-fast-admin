import type { HookResult } from "@nuxt/schema";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import type { DropdownOption } from "@ucstu/nuxt-naive-ui/exports";
import type { ShallowRef } from "vue-demi";
import type { CrudApi } from "./base";

export interface ModuleOptions {
  /**
   * 功能开关
   */
  features?: {
    /**
     * 自定义布局
     */
    layouts?: {
      /**
       * 全屏布局
       * @default true
       */
      full?: boolean;
      /**
       * 默认布局
       * @default true
       */
      default?: boolean;
    };
    /**
     * 自定义页面
     */
    pages?: {
      /**
       * iframe页面
       * @default true
       */
      iframe?: boolean;
      /**
       * 登录页面
       * @description 仅在 auth 模块开启时有效
       * @default true
       */
      auth?: boolean;
      /**
       * CRUD页面
       * @description 仅在 crud + fetch 模块开启时有效
       * @default true
       */
      crud?: boolean;
      /**
       * AMIS页面
       * @description 仅在 amis 模块开启时有效
       * @default true
       */
      amis?: boolean;
    };
  };
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastAdmin: ModuleOptionsDefaults & {
    modules: Array<
      | "@ucstu/nuxt-amis"
      | "@ucstu/nuxt-fast-auth"
      | "@ucstu/nuxt-fast-crud"
      | "@ucstu/nuxt-fast-fetch"
    >;
  };
}

export interface ModuleRuntimeHooks {
  /**
   * 头部下拉选择
   * @description 默认布局头部下拉选择
   */
  "fast-admin:layout-default-header-dropdown-select": (
    value: string | number,
    option: DropdownOption
  ) => HookResult;
  /**
   * 改变认证类型
   */
  "fast-admin:page-auth-forget-password": () => HookResult;
  /**
   * 获取 CRUD 配置
   */
  "fast-admin:get-crud-options": (
    api: CrudApi | undefined,
    resource: string,
    result: ShallowRef<any>
  ) => HookResult;
  /**
   * 获取 Amis 配置
   */
  "fast-admin:get-amis-options": (
    key: string,
    result: ShallowRef<any>
  ) => HookResult;
}
