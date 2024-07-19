import type { FastAuthForm } from "@ucstu/nuxt-fast-auth/types";
import type { CrudOptions } from "@ucstu/nuxt-fast-crud/exports";
import type {
  LiteralUnion,
  SetFieldType,
} from "@ucstu/nuxt-fast-utils/exports";
import type { DropdownOption } from "@ucstu/nuxt-naive-ui/exports";
import type { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";

// #region 应用相关
export interface AppOptions {
  /**
   * 错误边界
   * @default false
   */
  boundary?: boolean;
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
export interface LayoutDefaultOptions {
  /**
   * 菜单栏配置
   */
  menu?: {
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
  header?: {
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
    dropdown?: {
      /**
       * 显示菜单
       * @default true
       */
      show?: boolean;
      /**
       * 头像地址
       * @default base64
       */
      avatar?: string;
      /**
       * 菜单项
       */
      options?: Array<
        SetFieldType<DropdownOption, "icon", string | DropdownOption["icon"]>
      >;
    };
  };
  /**
   * 标签栏配置
   */
  tabbar?: {
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
export interface PageAuthOptions {
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
   * @default base64
   */
  picture?: string | false;
  /**
   * 背景图片
   * @default base64
   */
  background?: string | false;
  /**
   * 表单默认
   */
  form?: FastAuthForm;
}
// #endregion

// #region 请求相关
/**
 * 请求选项
 */
export interface FetchOptions {
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
  token?: {
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
  error?: ErrorOptions;
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
export interface ErrorOptions {
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

// #region CRUD相关
export interface CrudApi {
  [key: string]: object;
}

export type CrudSchemas =
  | OpenAPIV3.SchemaObject
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3_1.SchemaObject
  | OpenAPIV3_1.ReferenceObject;

export type CrudObjectSchema =
  | OpenAPIV3.SchemaObject
  | OpenAPIV3_1.SchemaObject;

export type CrudResFromSchema<Schema> = Schema extends { properties: infer Res }
  ? Res
  : unknown;

export type CrudReference<
  Api extends CrudApi,
  Key extends keyof Api & `$${string}`,
  Res extends Partial<CrudResFromSchema<Api[Key]>>,
> = {
  /**
   * API
   */
  api?: CrudApi;
  /**
   * 名称
   */
  name: LiteralUnion<keyof Api & `$${string}`, string>;
  /**
   * 字段
   */
  field: LiteralUnion<keyof Res, string>;
  /**
   * 覆盖
   */
  overrides?: Partial<CrudOptions<any>>;
  /**
   * 类型
   * @default multiple
   */
  type?: "single" | "multiple";
};

export interface $CrudOptions<
  Api extends CrudApi,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<CrudResFromSchema<Api[Name]>>,
> extends CrudOptions<Res> {
  /**
   * 资源名称
   */
  name: string;
  /**
   * 资源引用
   */
  references?: Array<
    LiteralUnion<keyof Res, string> | CrudReference<Api, Name, Res>
  >;
}
// #endregion
