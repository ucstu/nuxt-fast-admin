import {
  computed,
  navigateTo,
  readonly,
  useRuntimeConfig,
  useState,
  watch,
  type Ref,
} from "#imports";
import type { RouteLocationRaw } from "#vue-router";
import type { ReadonlyDeep } from "type-fest";
import type { BaseAuthHooks, FsAuthUser } from "../types";
import { useCookieSync, useStorageSync } from "../utils";
import { useAppConfigRef } from "./config";
import { useTokenExpires } from "./token";

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
export const useRemember = (): Ref<number | boolean> => {
  const config = useRuntimeConfig();
  return (
    config.public.fastAuth.ssr
      ? useCookieSync<number | boolean>("fast-auth-remember", {
          defaultValue: () => false,
          cookieOptions: computed(() => ({
            expires: useTokenExpires(true),
          })),
        })
      : useStorageSync<number | boolean>("fast-auth-remember", {
          storage: "localStorage",
          defaultValue: () => false,
        })
  ) as Ref<number | boolean>;
};
/**
 * 使用用户
 * @description 使用用户信息
 * @returns 用户
 */
export const useUser = (): Ref<FsAuthUser | undefined | null> =>
  useState<FsAuthUser | undefined | null>("fast-auth-user", () => undefined);
/**
 * 使用认证状态
 * @returns 认证状态
 */
export const useStatus = (): Ref<AuthStatus> =>
  useState<AuthStatus>("fast-auth-status", () => ({
    signIn: false,
    signUp: false,
    signOut: false,
    getUser: false,
    authed: false,
  }));
/**
 * 使用令牌
 * @returns 令牌
 */
export const useToken = (): Ref<string | undefined | null> => {
  const config = useRuntimeConfig();
  const remember = useRemember();
  return config.public.fastAuth.ssr
    ? useCookieSync<string>("fast-auth-token", {
        cookieOptions: computed(() => ({
          expires: useTokenExpires(remember.value),
        })),
      })
    : useStorageSync<string>("fast-auth-token", {
        storage: computed(() =>
          remember.value ? "localStorage" : "sessionStorage",
        ),
      });
};

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
 * 退出登录选项
 */
interface SignOutOptions extends NavigateOptions {}
/**
 * 退出登录
 * @param options 退出登录选项
 */
async function signOut(options: SignOutOptions = {}) {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const config = useAppConfigRef("fastAuth").value!;

  const { navigate = false } = options;

  status.value.signOut = true;
  const authHooks = config.authHooks as BaseAuthHooks;
  try {
    user.value = null;
    token.value = null;
    await authHooks.signOut?.();
  } catch (e) {
    status.value.signOut = false;
    throw e;
  }
  status.value.signOut = false;

  if (navigate) {
    navigateTo(
      navigate === true ? config.pages!.signIn! : navigate,
      options.navigateOptions,
    );
  }
}
/**
 * 获取用户信息
 * @param token 令牌
 */
async function getUser(token?: string | undefined | null) {
  const user = useUser();
  const _token = useToken();
  const status = useStatus();
  const config = useAppConfigRef("fastAuth").value!;

  status.value.getUser = true;
  const authHooks = config.authHooks as BaseAuthHooks;
  try {
    user.value = (await authHooks.getUser?.(token ?? _token.value)) || null;
  } catch (e) {
    status.value.getUser = false;
    throw e;
  }
  status.value.getUser = false;
}

export type UseAuthRet = {
  user: ReadonlyDeep<Ref<FsAuthUser | undefined | null>>;
  token: ReadonlyDeep<Ref<string | undefined | null>>;
  status: ReadonlyDeep<Ref<AuthStatus>>;
  remember: Ref<number | boolean>;
  signOut: typeof signOut;
  getUser: typeof getUser;
};
/**
 * 使用认证
 * @returns 认证
 */
export function useAuth(): UseAuthRet {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const remember = useRemember();

  watch(user, (value) => (status.value.authed = !!value), { immediate: true });

  return {
    user: readonly(user),
    token: readonly(token),
    status: readonly(status),
    remember,
    signOut: signOut,
    getUser: getUser,
  };
}
