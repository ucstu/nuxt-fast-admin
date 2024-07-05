import {
  cookieStorage,
  navigateTo,
  ref,
  sessionCookieStorage,
  useAppConfig,
  useSafeNuxtApp,
  useRuntimeConfig,
  useState,
  useStorage,
} from "#imports";
import type {
  FsAuthConfigDefaults,
  FsAuthForm,
  RefreshSignInResult,
} from "../types";
import {
  getUser,
  useAuth,
  useRemember,
  useToken,
  useUser,
  type AuthStatus,
  type SignInOptions,
  type SignOutOptions,
  type SignUpOptions,
} from "./use-auth";

/**
 * 刷新认证状态
 */
export interface RefreshAuthStatus extends AuthStatus {
  /**
   * 刷新中
   */
  refresh: boolean;
}

/**
 * 使用认证状态
 * @returns 认证状态
 */
export function useRefreshStatus() {
  return useState<RefreshAuthStatus>("fast-auth:status", () => ({
    signIn: false,
    signUp: false,
    signOut: false,
    getUser: false,
    authed: false,
    refresh: false,
  }));
}

/**
 * 使用刷新令牌
 * @returns 刷新令牌
 */
export function useRefreshToken() {
  const remember = useRemember();
  const runtimeConfig = useRuntimeConfig().public.fastUtils;
  return useStorage<string | undefined>(
    "fast-auth:refresh-token",
    undefined,
    () =>
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
 * 登录
 * @param form 登录表单
 * @param options 登录选项
 */
export async function refreshSignIn<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: SignInOptions = {}
) {
  const user = useUser();
  const token = useToken();
  const nuxtApp = useSafeNuxtApp();
  const status = useRefreshStatus();
  const rememberRef = useRemember();
  const refreshToken = useRefreshToken();
  const config = useAppConfig().fastAuth as FsAuthConfigDefaults;

  const { remember, navigate = false, navigateOptions } = options;

  status.value.signIn = true;
  try {
    const result = ref<RefreshSignInResult | undefined>();
    await nuxtApp.callHook("fast-auth:sign-in", form, result);
    if (result.value) {
      token.value = result.value.token;
      refreshToken.value = result.value.refreshToken;
      if (result.value.user) user.value = result.value.user;
      else await getUser(result.value.token);

      if (remember !== undefined) {
        rememberRef.value = remember;
      }
      if (navigate) {
        navigateTo(navigate === true ? config.home : navigate, navigateOptions);
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
 * 退出登录
 * @param options 退出登录选项
 */
export async function refreshSignOut(options: SignOutOptions = {}) {
  const user = useUser();
  const token = useToken();
  const nuxtApp = useSafeNuxtApp();
  const status = useRefreshStatus();
  const refreshToken = useRefreshToken();
  const config = useAppConfig().fastAuth as FsAuthConfigDefaults;

  const { navigate = false } = options;

  status.value.signOut = true;
  try {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
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
 * 注册
 * @param form 注册表单
 * @param options 注册选项
 */
export async function refreshSignUp<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: SignUpOptions = {}
) {
  const status = useRefreshStatus();
  const nuxtApp = useSafeNuxtApp();

  const { autoSignIn = true } = options;

  status.value.signUp = true;
  try {
    await nuxtApp.callHook("fast-auth:sign-up", form);
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
export async function refresh(
  refreshToken?: string | undefined | null,
  token?: string | undefined | null,
) {
  const user = useUser();
  const _token = useToken();
  const status = useRefreshStatus();
  const nuxtApp = useSafeNuxtApp();
  const _refreshToken = useRefreshToken();

  status.value.refresh = true;
  try {
    const result = ref<RefreshSignInResult | undefined>();
    await nuxtApp.callHook(
      "fast-auth:refresh-token" as any,
      refreshToken,
      token,
      result,
    );
    if (result.value) {
      _token.value = result.value.token;
      _refreshToken.value = result.value.refreshToken;
      if (result.value.user) user.value = result.value.user;
      else await getUser();
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

/**
 * 使用刷新认证
 * @returns 刷新认证
 */
export function useRefreshAuth<F extends FsAuthForm = FsAuthForm>() {
  const status = useRefreshStatus();
  const refreshToken = useRefreshToken();

  return {
    ...useAuth(),
    status,
    refreshToken,
    signIn: refreshSignIn<F>,
    signUp: refreshSignUp<F>,
    signOut: refreshSignOut,
    refresh,
  };
}
