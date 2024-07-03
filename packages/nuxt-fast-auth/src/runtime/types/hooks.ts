import type { Ref, navigateTo } from "#imports";
import type { RouteLocationNormalized } from "#vue-router";
import type { HookResult } from "@nuxt/schema";
import type { ReadonlyDeep } from "@ucstu/nuxt-fast-utils/types";
import type {
  FsAuthForm,
  FsAuthOptions,
  FsAuthPage,
  FsAuthPer,
  FsAuthUser,
} from "./base";

export interface BaseAuthHooks {
  /**
   * 注册
   * @param form 注册表单
   */
  "fast-auth:sign-up"(form: FsAuthForm): HookResult;
  /**
   * 注销
   */
  "fast-auth:sign-out"(): HookResult;
  /**
   * 获取用户
   * @param token 令牌
   * @param result 用户信息
   */
  "fast-auth:get-user"(
    token: string | undefined | null,
    result: Ref<FsAuthUser | undefined | null>,
  ): HookResult;
  /**
   * 获取角色列表
   * @param user 用户信息
   * @param result 角色列表
   */
  "fast-auth:get-roles"(
    user: ReadonlyDeep<FsAuthUser> | undefined | null,
    result: Ref<Exclude<FsAuthPer, boolean>[]>,
  ): void;
  /**
   * 获取权限列表
   * @param user 用户信息
   * @param result 权限列表
   */
  "fast-auth:get-permissions"(
    user: ReadonlyDeep<FsAuthUser> | undefined | null,
    result: Ref<Exclude<FsAuthPer, boolean>[]>,
  ): void;
}

export interface SignInResult {
  /**
   * 用户信息
   */
  user?: FsAuthUser;
}

export interface LocalSignInResult extends SignInResult {
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
   * @param result 令牌 | 登录结果
   */
  "fast-auth:sign-in"(
    form: FsAuthForm,
    result: Ref<string | LocalSignInResult | undefined>,
  ): HookResult;
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
export interface RefreshAuthHooks extends BaseAuthHooks {
  /**
   * 登录
   * @param form 登录表单
   * @param result 登录结果
   */
  "fast-auth:sign-in"(
    form: FsAuthForm,
    result: Ref<RefreshSignInResult | undefined>,
  ): HookResult;
  /**
   * 刷新令牌
   * @param refreshToken 刷新令牌
   * @param token 令牌
   * @param result 刷新结果
   */
  "fast-auth:refresh-token"?(
    refreshToken: string | undefined | null,
    token: string | undefined | null,
    result: Ref<RefreshSignInResult | undefined>,
  ): HookResult;
}

export type AuthHooks = FsAuthOptions extends {
  provider: { type: string };
}
  ? FsAuthOptions["provider"]["type"] extends "local"
    ? LocalAuthHooks
    : FsAuthOptions["provider"]["type"] extends "refresh"
      ? RefreshAuthHooks
      : FsAuthOptions["provider"]["type"] extends "base"
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
   * 前置认证钩子
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:before-auth"(
    options: GuardOptions,
    result: Ref<ReturnType<typeof navigateTo> | undefined>,
  ): void;
  /**
   * 无需认证
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:no-auth"(
    options: GuardOptions,
    result: Ref<ReturnType<typeof navigateTo> | undefined>,
  ): void;
  /**
   * 需要认证但未认证
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:un-auth"(
    options: GuardOptions,
    result: Ref<ReturnType<typeof navigateTo> | undefined>,
  ): void;
  /**
   * 需要鉴权且已通过
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:passed"(
    options: GuardOptions,
    result: Ref<ReturnType<typeof navigateTo> | undefined>,
  ): void;
  /**
   * 需要鉴权但未通过
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:failed"(
    options: GuardOptions,
    result: Ref<ReturnType<typeof navigateTo> | undefined>,
  ): void;
  /**
   * 后置认证钩子
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:after-auth"(
    options: GuardOptions,
    result: Ref<ReturnType<typeof navigateTo> | undefined>,
  ): void;
}
