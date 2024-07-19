import type { navigateTo } from "#imports";
import type { HookResult } from "@nuxt/schema";
import type {
  ReadonlyDeep,
  RemovableRef,
} from "@ucstu/nuxt-fast-utils/exports";
import type { Ref, ShallowRef } from "vue-demi";
import type {
  FastAuthForm,
  FastAuthOptions,
  FastAuthPageFilled,
  FastAuthPer,
  FastAuthToken,
  FastAuthUser,
} from "./base";

export interface BaseAuthHooks {
  /**
   * 注册
   * @param form 注册表单
   */
  "fast-auth:sign-up"(form: FastAuthForm): HookResult;
  /**
   * 获取用户
   * @param token 令牌
   * @param result 用户信息
   */
  "fast-auth:get-user"(
    token: string | undefined | null,
    result: Ref<FastAuthUser | undefined>,
  ): HookResult;
  /**
   * 获取角色列表
   * @param user 用户信息
   * @param result 角色列表
   */
  "fast-auth:get-roles"(
    user: ReadonlyDeep<FastAuthUser> | undefined | null,
    result: ShallowRef<Array<FastAuthPer>>,
  ): void;
  /**
   * 获取权限列表
   * @param user 用户信息
   * @param role 角色信息
   * @param result 权限列表
   */
  "fast-auth:get-permissions"(
    user: ReadonlyDeep<FastAuthUser> | undefined | null,
    role: ReadonlyDeep<FastAuthPer> | undefined | null,
    result: ShallowRef<Array<FastAuthPer>>,
  ): void;
}

export interface SignInResult {
  /**
   * 用户信息
   */
  user?: FastAuthUser;
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
    form: FastAuthForm,
    result: ShallowRef<string | LocalSignInResult | undefined>,
  ): HookResult;
  /**
   * 注销
   */
  "fast-auth:sign-out"(
    user: Ref<FastAuthUser>,
    token: RemovableRef<FastAuthToken>,
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
    form: FastAuthForm,
    result: ShallowRef<RefreshSignInResult | undefined>,
  ): HookResult;
  /**
   * 注销
   */
  "fast-auth:sign-out"(
    user: Ref<FastAuthUser | undefined>,
    token: RemovableRef<FastAuthToken>,
    refreshToken: RemovableRef<FastAuthToken>,
  ): HookResult;
  /**
   * 刷新令牌
   * @param token 令牌
   * @param refreshToken 刷新令牌
   * @param result 刷新结果
   */
  "fast-auth:refresh-token"(
    token: string | undefined | null,
    refreshToken: string | undefined | null,
    result: ShallowRef<RefreshSignInResult | undefined>,
  ): HookResult;
}

export type AuthHooks = FastAuthOptions extends {
  provider: string;
}
  ? FastAuthOptions["provider"] extends "local"
    ? LocalAuthHooks
    : FastAuthOptions["provider"] extends "refresh"
      ? RefreshAuthHooks
      : FastAuthOptions["provider"] extends "base"
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
  to: FastAuthPageFilled;
  /**
   * 来源路由
   */
  from: FastAuthPageFilled;
  /**
   * 用户信息
   */
  user: FastAuthUser | undefined;
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
    result: ShallowRef<ReturnType<typeof navigateTo> | undefined>,
  ): void;
  /**
   * 无需认证
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:auth-through"(
    options: GuardOptions,
    result: ShallowRef<ReturnType<typeof navigateTo> | undefined>,
  ): void;
  /**
   * 需要认证但未登录
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:auth-anonymous"(
    options: GuardOptions,
    result: ShallowRef<ReturnType<typeof navigateTo> | undefined>,
  ): void;
  /**
   * 需要鉴权且已通过
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:auth-passed"(
    options: GuardOptions,
    result: ShallowRef<ReturnType<typeof navigateTo> | undefined>,
  ): void;
  /**
   * 需要鉴权但未通过
   * @param options 选项
   * @param result 跳转 | null
   * @description 返回值为 null 时继续路由守卫
   * @description 返回值为 undefined 时终止路由守卫
   * @description 注意：不写返回值时默认返回 undefined
   */
  "fast-auth:auth-failed"(
    options: GuardOptions,
    result: ShallowRef<ReturnType<typeof navigateTo> | undefined>,
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
    result: ShallowRef<ReturnType<typeof navigateTo> | undefined>,
  ): void;
}
