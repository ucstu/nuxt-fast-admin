import type { navigateTo } from "#imports";
import type { RouteLocationNormalized } from "#vue-router";
import type { ReadonlyDeep, UnknownRecord } from "type-fest";
import type {
  FsAuthConfigOption,
  FsAuthForm,
  FsAuthMeta,
  FsAuthPage,
  FsAuthPer,
  FsAuthUser,
} from "./base";

export interface BaseAuthHooks {
  /**
   * 注册
   * @param form 注册表单
   */
  signUp?(form: FsAuthForm): void | Promise<void>;
  /**
   * 注销
   */
  signOut?(): void | Promise<void>;
  /**
   * 获取用户
   * @param token 令牌
   * @returns 用户信息
   */
  getUser?(
    token: string | undefined | null,
  ): FsAuthUser | undefined | null | Promise<FsAuthUser | undefined | null>;
  /**
   * 获取权限列表
   * @param user 用户信息
   * @returns 权限列表
   */
  getPermissions?(
    user: ReadonlyDeep<FsAuthUser> | undefined | null,
  ): Exclude<FsAuthPer, boolean>[];
}

export interface LocalSignInResult {
  /**
   * 令牌
   */
  token: string;
  /**
   * 令牌有效时间
   * @description 令牌有效时间，单位为毫秒
   * - '0' 令牌有效时间直到浏览器关闭
   * - `number` 令牌有效时间 (单位: 毫秒)
   * @default 来自模块配置
   */
  tokenExpires?: number;
}
export interface LocalAuthHooks extends BaseAuthHooks {
  /**
   * 登录
   * @param form 登录表单
   * @returns 令牌 | 登录结果
   */
  signIn?(
    form: FsAuthForm,
  ): string | Promise<string> | LocalSignInResult | Promise<LocalSignInResult>;
}

export interface RefreshSignInResult extends LocalSignInResult {
  /**
   * 刷新令牌
   */
  refreshToken: string;
  /**
   * 刷新令牌有效时间
   * @description 刷新令牌有效时间，单位为毫秒
   * - '0' 刷新令牌有效时间直到浏览器关闭
   * - `number` 刷新令牌有效时间 (单位: 毫秒)
   * @default 来自模块配置
   */
  refreshTokenExpires?: number;
}
export interface RefreshAuthHooks extends LocalAuthHooks {
  /**
   * 登录
   * @param form 登录表单
   * @returns 登录结果
   */
  signIn?(form: FsAuthForm): RefreshSignInResult | Promise<RefreshSignInResult>;
  /**
   * 刷新
   * @param refreshToken 刷新令牌
   */
  refresh?(
    refreshToken: string | undefined | null,
    token: string | undefined | null,
  ): RefreshSignInResult | Promise<RefreshSignInResult>;
}

export type AuthHooks = FsAuthConfigOption extends {
  provider: { type: string };
}
  ? FsAuthConfigOption["provider"]["type"] extends "local"
    ? LocalAuthHooks
    : FsAuthConfigOption["provider"]["type"] extends "refresh"
      ? RefreshAuthHooks
      : FsAuthConfigOption["provider"]["type"] extends "base"
        ? BaseAuthHooks
        : BaseAuthHooks & LocalAuthHooks & RefreshAuthHooks
  : BaseAuthHooks & LocalAuthHooks & RefreshAuthHooks;

/**
 * 页面鉴权钩子选项
 */
export interface GuardOptions {
  /**
   * 目标路由
   */
  to: RouteLocationNormalized;
  /**
   * 来源路由
   */
  from: RouteLocationNormalized;
  /**
   * 用户信息
   */
  user: FsAuthUser | undefined | null;
  /**
   * 页面鉴权元数据
   */
  page: FsAuthPage;
}

export interface PageHooks {
  /**
   * 获取页面鉴权元数据
   * @param options 选项
   * @returns 页面鉴权元数据
   */
  getPageMeta?(
    options: GuardOptions,
  ): FsAuthPage | undefined | null | Promise<FsAuthPage | undefined | null>;
  /**
   * 前置认证钩子
   * @param options 选项
   * @returns 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  beforeAuth?: (options: GuardOptions) => ReturnType<typeof navigateTo> | null;
  /**
   * 无需认证
   * @param options 选项
   * @returns 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  noAuth?: (options: GuardOptions) => ReturnType<typeof navigateTo> | null;
  /**
   * 需要认证但未认证
   * @param options 选项
   * @returns 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  unAuth?: (options: GuardOptions) => ReturnType<typeof navigateTo> | null;
  /**
   * 需要鉴权且已通过
   * @param options 选项
   * @returns 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  passed?: (options: GuardOptions) => ReturnType<typeof navigateTo> | null;
  /**
   * 需要鉴权但未通过
   * @param options 选项
   * @returns 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  failed?: (options: GuardOptions) => ReturnType<typeof navigateTo> | null;
  /**
   * 后置认证钩子
   * @param options 选项
   * @returns 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  afterAuth?: (options: GuardOptions) => ReturnType<typeof navigateTo> | null;
}

export interface FsAuthConfig {
  /**
   * 认证提供者配置
   */
  provider?: UnknownRecord & {
    /**
     * 默认令牌有效时间
     * @description 令牌有效时间，单位为毫秒
     * @default 256 * 24 * 60 * 60 * 1000
     */
    tokenExpires?: number;
    /**
     * 刷新令牌有效时间
     * @description 刷新令牌有效时间，单位为毫秒
     * @default 256 * 24 * 60 * 60 * 1000
     */
    refreshTokenExpires?: number;
    /**
     * 页面聚焦时刷新令牌
     * @description 当窗口重新获得焦点时刷新令牌
     * @default true
     */
    refreshOnWindowFocus?: boolean;
  };
  /**
   * 会话（用户信息）配置
   * @description 会话配置
   */
  session?: UnknownRecord & {
    /**
     * 定时刷新会话的时间间隔，单位为毫秒
     * - `0` 表示禁用定时刷新
     * - `number` 表示启用定时刷新，且指定时间间隔
     * @default 0
     */
    refreshPeriodically?: number;
    /**
     * 当窗口获得焦点时刷新会话
     * @default false
     */
    refreshOnWindowFocus?: boolean;
  };
  /**
   * 页面配置
   * @description 页面配置
   */
  pages?: UnknownRecord & {
    /**
     * 首页路径
     * @description 登录成功后重定向的路径
     * @default "/"
     */
    home?: string;
    /**
     * 认证页路径
     * @default "/auth"
     */
    signIn?: string;
    /**
     * 退出登录页路径
     * @default "/auth"
     */
    signOut?: string;
    /**
     * 默认页面鉴权元数据
     * @default
     * ```json
     * {
     *  "auth": false,
     *  "redirect": {
     *   "unAuth": true,
     *   "passed": false,
     *   "failed": true
     *  }
     * }
     * ```
     */
    authMeta?: FsAuthPage | FsAuthMeta;
  };
  /**
   * 认证钩子函数
   */
  authHooks?: UnknownRecord & AuthHooks;
  /**
   * 页面鉴权钩子
   * @description 钩子调用顺序
   * - beforeAuth 前置认证
   * - 如果无需认证则调用 noAuth
   * - 如果需要认证但未认证则调用 unAuth
   * - 如果需要鉴权且已通过则调用 passed
   * - 如果需要鉴权但未通过则调用 failed
   * - afterAuth 后置认证
   */
  pageHooks?: UnknownRecord & PageHooks;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    fastAuth?: FsAuthConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    fastAuth?: FsAuthConfig;
  }
}
