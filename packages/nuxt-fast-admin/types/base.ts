import type { ConfigProviderProps, DropdownOption, MenuOption } from "naive-ui";
import type { FetchOptions, ResponseType } from "ofetch";
import type { SetFieldType, UnknownRecord } from "type-fest";

// #region 应用相关
export interface AppConfig {
  /**
   * 错误边界
   * @default false
   */
  boundary?: boolean;
  /**
   * Naive配置
   * @default {}
   */
  naiveConfig?: ConfigProviderProps;
  /**
   * 添加页头
   * @default true
   */
  head: boolean;
}
// #endregion

// #region 布局相关
/**
 * 默认布局配置
 */
export interface DefaultLayoutConfig {
  /**
   * 菜单栏配置
   */
  menu?: UnknownRecord & {
    /**
     * 宽度
     * @default 272
     */
    width?: number;
    /**
     * 折叠默认值
     * @default false
     */
    collapsed?: boolean;
    /**
     * 折叠宽度
     * @default 56
     */
    collapsedWidth?: number;
  };
  /**
   * 头部栏配置
   */
  header?: UnknownRecord & {
    /**
     * 显示头部栏
     * @default true
     */
    show?: boolean;
    /**
     * 显示刷新按钮
     * @default false
     */
    reload?: boolean;
    /**
     * 显示折叠按钮
     * @default true
     */
    collapsed?: boolean;
    /**
     * 显示面包屑
     * @default true
     */
    breadcrumb?: boolean;
    /**
     * 显示全屏按钮
     * @default false
     */
    fullscreen?: boolean;
    /**
     * 显示主题按钮
     * @default false
     */
    theme?: boolean;
    /**
     * 下拉菜单
     */
    dropdown?: UnknownRecord & {
      /**
       * 显示菜单
       * @default true
       */
      show?: boolean;
      /**
       * 头像地址
       * @default /images/layouts/default/header/avatar.svg
       */
      avatar?: string;
      /**
       * 菜单项
       */
      options?: Array<
        SetFieldType<DropdownOption, "icon", string | DropdownOption["icon"]>
      >;
      /**
       * 钩子函数
       */
      hooks?: UnknownRecord & {
        /**
         * 选择菜单
         * @param key 键
         */
        select?: (key: string) => void;
      };
    };
  };
  /**
   * 标签栏配置
   */
  tabbar?: UnknownRecord & {
    /**
     * 显示标签栏
     * @default true
     */
    show?: boolean;
    /**
     * 显示刷新按钮
     * @default true
     */
    refresh?: boolean;
    /**
     * 显示全屏按钮
     * @default true
     */
    fullscreen?: boolean;
    /**
     * 显示操作按钮
     * @default true
     */
    actions?: boolean;
  };
}
// #endregion

// #region 页面相关
/**
 * 鉴权页面选项
 */
export interface AuthPageConfig {
  /**
   * 是否显示忘记密码
   * @default true
   */
  forget?: boolean;
  /**
   * 是否显示注册
   * @default true
   */
  register?: boolean;
  /**
   * 是否显示记住我
   * @default true
   */
  remember?: boolean;
  /**
   * 左侧图片
   * @default /images/pages/auth/picture.png
   */
  picture?: string | false;
  /**
   * 背景图片
   * @default /images/pages/auth/background.png
   */
  background?: string | false;
  /**
   * 钩子函数
   */
  hooks?: UnknownRecord & {
    /**
     * 忘记密码
     */
    forget?: () => Promise<void> | void;
    /**
     * 注册
     */
    signUp?: () => Promise<void> | void;
  };
}
// #endregion

// #region 钩子函数
export interface HooksConfig {
  /**
   * 菜单选项
   * @param options 选项
   * @returns 选项
   */
  menuOptions?: (options: MenuOption) => MenuOption | undefined;
  /**
   * 请求选项
   * @param options 选项
   * @returns 选项
   */
  fetchOptions?: (
    options: FetchOptions<ResponseType>,
  ) => FetchOptions<ResponseType>;
}
// #endregion

// #region 请求相关
/**
 * 请求选项
 */
export interface FetchConfig {
  /**
   * 状态路径
   * @description 接口返回错误状态码路径
   * @default code
   */
  status?: string;
  /**
   * 消息路径
   * @description 接口返回错误消息路径
   * @default msg
   */
  message?: string;
  /**
   * token 配置
   */
  token?: UnknownRecord & {
    /**
     * token 名称
     * @default Authorization
     */
    name?: string;
    /**
     * token 类型
     * @default Bearer
     */
    type?: string;
  };
  /**
   * 错误配置
   * @description 请求错误配置
   */
  error?: UnknownRecord & ErrorConfig;
}
// #endregion

// #region 错误相关
/**
 * 错误处理器
 * - message: 消息提示
 * - dialog: 弹窗提示
 * - notify: 通知提示
 * - global: 全局异常
 * - none: 不处理
 */
export type ErrorHandler = "message" | "dialog" | "notify" | "global" | "none";
/**
 * 错误等级
 * - info: 信息
 * - success: 成功
 * - warning: 警告
 * - error: 错误
 */
export type ErrorLevel = "info" | "success" | "warning" | "error";
/**
 * 错误选项
 */
export interface ErrorConfig {
  /**
   * 错误处理器
   * @default message
   */
  handler?: ErrorHandler;
  /**
   * 错误等级
   * @default error
   */
  level?: ErrorLevel;
  /**
   * 防抖间隔 (ms)
   * @default 300
   */
  interval?: number;
  /**
   * 持续时间 (ms)
   * @default 3000
   */
  duration?: number;
  /**
   * 是否继续传播
   * @description 如果为 true，则会返回 false
   * @default true
   */
  propagate?: boolean;
}
// #endregion
