import type { NuxtApp } from "#app";
import {
  $useRuntimeConfig,
  cookieStorage,
  navigateTo,
  sessionCookieStorage,
  shallowRef,
  useModuleConfig,
  useNuxtApp,
  useNuxtStorage,
} from "#imports";
import { createGlobalState } from "@ucstu/nuxt-fast-utils/exports";
import { configKey } from "../config";
import type {
  FastAuthForm,
  FastAuthToken,
  RefreshSignInResult,
} from "../types";
import {
  useAuth,
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
 * 使用刷新认证
 * @returns 刷新认证
 */
export const useRefreshAuth = createGlobalState(function <
  F extends FastAuthForm = FastAuthForm,
>(nuxtApp: NuxtApp = useNuxtApp()) {
  const auth = useAuth<RefreshAuthStatus>(nuxtApp);
  const authConfig = useModuleConfig(configKey, nuxtApp);
  const fastUtilsConfig = $useRuntimeConfig(nuxtApp).public.fastUtils;

  const {
    token: _token,
    user: _user,
    status: _status,
    remember: _remember,
    refreshUser,
  } = auth;

  const _refreshToken = useNuxtStorage<FastAuthToken>(
    "fast-auth:refresh-token",
    () => ({}),
    () =>
      fastUtilsConfig.ssr
        ? _remember.value
          ? cookieStorage
          : sessionCookieStorage
        : _remember.value
          ? localStorage
          : sessionStorage,
    { nuxtApp },
  );

  /**
   * 登录
   * @param form 登录表单
   * @param options 登录选项
   */
  async function signIn<F extends FastAuthForm = FastAuthForm>(
    form: F,
    options: SignInOptions = {},
  ) {
    const { remember, navigate = false, navigateOptions } = options;

    try {
      _status.value.signIn = true;
      const result = shallowRef<RefreshSignInResult | undefined>();
      await nuxtApp.callHook("fast-auth:sign-in", form, result);
      if (result.value) {
        _token.value = {
          value: result.value.token,
          create: new Date().getTime(),
          expires: result.value.tokenExpires,
        };
        _refreshToken.value = {
          value: result.value.refreshToken,
          create: new Date().getTime(),
          expires: result.value.refreshTokenExpires,
        };
        if (result.value.user) _user.value = result.value.user;
        else await refreshUser(result.value.token);

        if (remember !== undefined) {
          _remember.value = remember;
        }
        if (navigate) {
          await navigateTo(
            navigate === true ? authConfig.value.home : navigate,
            navigateOptions,
          );
        }
      }
    } finally {
      _status.value.signIn = false;
    }
  }

  /**
   * 退出登录
   * @param options 退出登录选项
   */
  async function signOut(options: SignOutOptions = {}) {
    const { navigate = false } = options;

    try {
      _status.value.signOut = true;
      await nuxtApp.callHook(
        "fast-auth:sign-out",
        _user,
        _token,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _refreshToken,
      );
      if (navigate) {
        await navigateTo(
          navigate === true ? authConfig.value.signIn : navigate,
          options.navigateOptions,
        );
      }
    } finally {
      _status.value.signOut = false;
    }
  }

  /**
   * 注册
   * @param form 注册表单
   * @param options 注册选项
   */
  async function signUp(form: F, options: SignUpOptions = {}) {
    const { autoSignIn = true } = options;

    try {
      _status.value.signUp = true;
      await nuxtApp.callHook("fast-auth:sign-up", form);
    } finally {
      _status.value.signUp = false;
    }

    if (autoSignIn) await signIn(form, options);
  }

  /**
   * 刷新令牌
   * @param token 令牌
   * @param refreshToken 刷新令牌
   * @description 刷新令牌
   */
  async function refresh(
    token?: string | undefined | null,
    refreshToken?: string | undefined | null,
  ) {
    try {
      _status.value.refresh = true;
      const result = shallowRef<RefreshSignInResult | undefined>();
      await nuxtApp.callHook(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "fast-auth:refresh-token",
        token,
        refreshToken,
        result,
      );
      if (result.value) {
        _token.value = {
          value: result.value.token,
          create: new Date().getTime(),
          expires: result.value.tokenExpires,
        };
        _refreshToken.value = {
          value: result.value.refreshToken,
          create: new Date().getTime(),
          expires: result.value.refreshTokenExpires,
        };
        if (result.value.user) _user.value = result.value.user;
        else await refreshUser();
      }
    } finally {
      _status.value.refresh = false;
    }
  }

  return {
    ...auth,
    signIn,
    signOut,
    signUp,
    refresh,
    refreshToken: _refreshToken,
  };
});
