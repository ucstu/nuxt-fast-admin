import {
  cookieStorage,
  navigateTo,
  sessionCookieStorage,
  useAppConfig,
  useSafeNuxtApp,
  useRuntimeConfig,
  useState,
  useStorage,
} from "#imports";
import type { RouteLocationRaw } from "#vue-router";
import type { FsAuthConfigDefaults, FsAuthUser } from "../types";

/**
 * 认证状态
 */
export interface AuthStatus {
  /**
   * 登录中
   */
  signIn: boolean;
  /**
   * 注册中
   */
  signUp: boolean;
  /**
   * 退出中
   */
  signOut: boolean;
  /**
   * 获取用户中
   * @description 获取用户信息中
   */
  getUser: boolean;
  /**
   * 已登录
   */
  authed?: boolean;
}

/**
 * 使用记住登录
 * @returns 记住登录
 */
export function useRemember() {
  return useStorage<boolean>("fast-auth:remember", false);
}

/**
 * 使用用户
 * @description 使用用户信息
 * @returns 用户
 */
export function useUser() {
  return useState<FsAuthUser | undefined | null>(
    "fast-auth:user",
    () => undefined
  );
}

/**
 * 使用认证状态
 * @returns 认证状态
 */
export function useStatus() {
  return useState<AuthStatus>("fast-auth:status", () => ({
    signIn: false,
    signUp: false,
    signOut: false,
    getUser: false,
    authed: false,
  }));
}

/**
 * 使用令牌
 * @returns 令牌
 */
export function useToken() {
  const remember = useRemember();
  const runtimeConfig = useRuntimeConfig().public.fastUtils;
  return useStorage<string | undefined>("fast-auth:token", undefined, () =>
    runtimeConfig.ssr
      ? remember.value
        ? cookieStorage
        : sessionCookieStorage
      : remember.value
      ? localStorage
      : sessionStorage
  );
}

/**
 * 跳转选项
 * @description 跳转选项
 */
export interface NavigateOptions {
  /**
   * 自动跳转
   * @description 为 `string` 时，表示跳转到指定路由
   * @description 为 `false` 时，表示不跳转到任何路由
   * @description 为 `true` 时，表示跳转默认路径
   * @default false
   */
  navigate?: boolean | RouteLocationRaw;
  /**
   * 跳转选项
   * @default { replace: false }
   */
  navigateOptions?: Parameters<typeof navigateTo>[1];
}

/**
 * 登录选项
 */
export interface SignInOptions extends NavigateOptions {
  /**
   * 保持登录状态
   * @description 保持登录状态的时间，单位为毫秒
   * - `false` 保持登录状态直到浏览器关闭
   * - `true` 保持登录状态直到手动退出
   */
  remember?: boolean;
}
/**
 * 注册选项
 */
export interface SignUpOptions extends SignInOptions {
  /**
   * 注册成功后是否自动登录
   * @default true
   */
  autoSignIn?: boolean;
}
/**
 * 退出登录选项
 */
export interface SignOutOptions extends NavigateOptions {}
/**
 * 退出登录
 * @param options 退出登录选项
 */
export async function signOut(options: SignOutOptions = {}) {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const config = useAppConfig().fastAuth as FsAuthConfigDefaults;
  const nuxtApp = useSafeNuxtApp();

  const { navigate = false } = options;

  status.value.signOut = true;
  try {
    user.value = null;
    token.value = null;
    await nuxtApp.callHook("fast-auth:sign-out");
  } catch (e) {
    status.value.signOut = false;
    throw e;
  }
  status.value.signOut = false;

  if (navigate) {
    navigateTo(
      navigate === true ? config.signIn : navigate,
      options.navigateOptions
    );
  }
}
/**
 * 获取用户信息
 * @param token 令牌
 */
export async function getUser(token = useToken().value) {
  const user = useUser();
  const status = useStatus();
  const nuxtApp = useSafeNuxtApp();

  status.value.getUser = true;
  try {
    await nuxtApp.callHook("fast-auth:get-user", token, user);
  } catch (e) {
    status.value.getUser = false;
    throw e;
  }
  status.value.getUser = false;
}

/**
 * 使用认证
 * @returns 认证
 */
export function useAuth() {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const remember = useRemember();

  return {
    user,
    token,
    status,
    remember,
    signOut,
    getUser,
  };
}
