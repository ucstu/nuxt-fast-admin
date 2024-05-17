import {
  computed,
  navigateTo,
  readonly,
  useRuntimeConfig,
  useState,
  type Ref,
} from "#imports";
import type { ReadonlyDeep } from "type-fest";
import type { FsAuthForm, RefreshAuthHooks } from "../types";
import { useCookieSync, useStorageSync } from "../utils";
import { useAppConfigRef } from "./config";
import { useTokenExpires } from "./token";
import {
  useAuth,
  useRemember,
  useToken,
  useUser,
  type AuthStatus,
  type NavigateOptions,
  type UseAuthRet,
} from "./use-auth";

/**
 * 刷新认证状态
 */
export interface RefreshAuthStatus extends AuthStatus {
  refresh: boolean;
}

/**
 * 使用认证状态
 * @returns 认证状态
 */
const useStatus = (): Ref<RefreshAuthStatus> =>
  useState<RefreshAuthStatus>("fast-auth-status", () => ({
    signIn: false,
    signUp: false,
    signOut: false,
    getUser: false,
    authed: false,
    refresh: false,
  }));
/**
 * 使用刷新令牌
 * @returns 刷新令牌
 */
const useRefreshToken = (): Ref<string | undefined | null> => {
  const config = useRuntimeConfig();
  const remember = useRemember();
  return config.public.fastAuth.ssr
    ? useCookieSync<string>("fast-auth-refresh-token", {
        cookieOptions: computed(() => ({
          expires: useTokenExpires(remember.value),
        })),
      })
    : useStorageSync<string>("fast-auth-refresh-token", {
        storage: computed(() =>
          remember.value ? "localStorage" : "sessionStorage",
        ),
      });
};

/**
 * 登录选项
 * @description 登录选项
 */
interface RefreshSignOptions extends NavigateOptions {
  /**
   * 保持登录状态
   * @description 保持登录状态的时间，单位为毫秒
   * - `false` 保持登录状态直到浏览器关闭
   * - `true` 使用 singIn 钩子返回的 tokenExpires 字段 或者 模块默认配置
   * - `0` 保持登录状态直到浏览器关闭
   * - `number` 保持登录状态的时间 (单位: 毫秒)
   * @default false
   */
  remember?: number | boolean;
}
/**
 * 登录
 * @param form 登录表单
 * @param options 登录选项
 */
async function refreshSignIn<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: RefreshSignOptions = {},
) {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const { getUser } = useAuth();
  const rememberRef = useRemember();
  const refreshToken = useRefreshToken();
  const config = useAppConfigRef("fastAuth").value!;

  const { remember = false, navigate = false, navigateOptions } = options;

  status.value.signIn = true;
  const authHooks = config.authHooks as RefreshAuthHooks;
  try {
    const result = (await authHooks.signIn?.(form)) || null;
    if (result) {
      if (remember === true) {
        rememberRef.value =
          result.tokenExpires ?? config.provider?.tokenExpires ?? 0;
      } else {
        rememberRef.value = remember;
      }
      token.value = result.token;
      refreshToken.value = result.refreshToken;
      await getUser(result.token);
      if (navigate) {
        navigateTo(
          navigate === true ? config.pages!.home! : navigate,
          navigateOptions,
        );
      }
    } else {
      token.value = null;
      refreshToken.value = null;
      user.value = null;
    }
  } catch (e) {
    status.value.signIn = false;
    throw e;
  }
  status.value.signIn = false;
}

/**
 * 退出登录选项
 */
interface RefreshSignOutOptions extends NavigateOptions {}
/**
 * 退出登录
 * @param options 退出登录选项
 */
async function refreshSignOut(options: RefreshSignOutOptions = {}) {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const refreshToken = useRefreshToken();
  const config = useAppConfigRef("fastAuth").value!;

  const { navigate = false } = options;

  status.value.signOut = true;
  const authHooks = config.authHooks as RefreshAuthHooks;
  try {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
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
 * 注册选项
 * @description 注册选项
 * @description 注意：跳转配置仅针对自动登录成功后有效
 */
interface RefreshSignUpOptions extends RefreshSignOptions {
  /**
   * 注册成功后是否自动登录
   * @default true
   */
  autoSignIn?: boolean;
}
/**
 * 注册
 * @param form 注册表单
 * @param options 注册选项
 */
async function refreshSignUp<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: RefreshSignUpOptions = {},
) {
  const status = useStatus();
  const config = useAppConfigRef("fastAuth").value!;

  const { autoSignIn = true } = options;

  status.value.signUp = true;
  const authHooks = config.authHooks as RefreshAuthHooks;
  try {
    await authHooks.signUp?.(form);
  } catch (e) {
    status.value.signUp = false;
    throw e;
  }
  status.value.signUp = false;

  if (autoSignIn) await refreshSignIn<F>(form, options);
}

/**
 * 刷新令牌
 * @description 刷新令牌
 */
async function refresh(
  refreshToken?: string | undefined | null,
  token?: string | undefined | null,
) {
  const _token = useToken();
  const status = useStatus();
  const config = useAppConfigRef("fastAuth").value!;
  const { getUser } = useAuth();
  const _refreshToken = useRefreshToken();

  status.value.refresh = true;
  const authHooks = config.authHooks as RefreshAuthHooks;
  try {
    const result =
      (await authHooks.refresh?.(
        refreshToken ?? _refreshToken.value,
        token ?? _token.value,
      )) || null;
    if (result) {
      _token.value = result.token;
      _refreshToken.value = result.refreshToken;
      await getUser();
    } else {
      _token.value = "";
      _refreshToken.value = "";
    }
  } catch (e) {
    status.value.refresh = false;
    throw e;
  }
  status.value.refresh = false;
}

export type UseRefreshAuthRet<F extends FsAuthForm = FsAuthForm> =
  UseAuthRet & {
    status: ReadonlyDeep<Ref<RefreshAuthStatus>>;
    refreshToken: ReadonlyDeep<Ref<string | undefined | null>>;
    signIn: typeof refreshSignIn<F>;
    signUp: typeof refreshSignUp<F>;
    refresh: typeof refresh;
  };
/**
 * 使用刷新认证
 * @returns 刷新认证
 */
export function useRefreshAuth<
  F extends FsAuthForm = FsAuthForm,
>(): UseRefreshAuthRet<F> {
  const status = useStatus();
  const refreshToken = useRefreshToken();

  return {
    ...useAuth(),
    status: readonly(status),
    refreshToken: readonly(refreshToken),
    signOut: refreshSignOut,
    signIn: refreshSignIn<F>,
    signUp: refreshSignUp<F>,
    refresh,
  };
}
