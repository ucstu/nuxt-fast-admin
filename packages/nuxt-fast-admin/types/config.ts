import type { UnknownRecord } from "type-fest";
import type {
  AppConfig,
  AuthPageConfig,
  DefaultLayoutConfig,
  ErrorConfig,
  FetchConfig,
  HooksConfig,
} from "./base";

export interface FsAdminConfig {
  /**
   * 项目名称
   */
  name?: string;
  /**
   * 项目LOGO
   */
  logo?: string;
  /**
   * 应用配置
   */
  app?: UnknownRecord & AppConfig;
  /**
   * 布局配置
   */
  layouts?: UnknownRecord & {
    /**
     * 默认布局
     */
    default?: UnknownRecord & DefaultLayoutConfig;
  };
  /**
   * 页面配置
   */
  pages?: UnknownRecord & {
    /**
     * 鉴权页面
     */
    auth?: UnknownRecord & AuthPageConfig;
  };
  /**
   * 钩子函数
   */
  hooks?: UnknownRecord & HooksConfig;
  /**
   * 请求配置
   */
  fetch?: UnknownRecord & FetchConfig;
  /**
   * 错误配置
   */
  error?: UnknownRecord & ErrorConfig;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    fastAdmin?: FsAdminConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    fastAdmin?: FsAdminConfig;
  }
}
