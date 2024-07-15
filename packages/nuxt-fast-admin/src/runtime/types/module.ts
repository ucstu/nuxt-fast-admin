import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";

export interface ModuleOptions {
  /**
   * 可选模块
   * @default []
   */
  modules?: Array<"auth" | "crud" | "fetch">;
  /**
   * 用户自定义
   */
  customize?: {
    /**
     * 自定义布局
     */
    layouts?: {
      /**
       * 全屏布局
       * @default false
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
       * @default false
       */
      auth?: boolean;
    };
  };
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastCrud: ModuleOptionsDefaults;
}
