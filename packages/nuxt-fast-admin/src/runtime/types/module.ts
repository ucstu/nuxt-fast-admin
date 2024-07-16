import type { HookResult } from "@nuxt/schema";
import type { FastNavPageFilled } from "@ucstu/nuxt-fast-nav/types";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import type { DropdownOption } from "@ucstu/nuxt-naive-ui/exports";
import type { ShallowRef } from "vue-demi";

export interface ModuleOptions {
  /**
   * 可选模块
   * @default []
   */
  modules?: Array<"auth" | "crud" | "fetch">;
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
       * 登录页面
       * @default "auto"
       */
      auth?: boolean | "auto";
    };
  };
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastCrud: ModuleOptionsDefaults;
}

export interface ModuleRuntimeHooks {
  /**
   * 获取页面标题
   * @param input 输入
   * @param result 结果
   */
  "fast-admin:get-app-head-title": (
    input: FastNavPageFilled | undefined,
    result: ShallowRef<string>
  ) => void;
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
}
