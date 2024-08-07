import type { NuxtApp } from "#app";
import { navigateTo, shallowRef, useModuleConfig, useNuxtApp } from "#imports";
import { createGlobalState } from "@ucstu/nuxt-fast-utils/exports";
import { configKey } from "../config";
import type { FastAuthForm, LocalSignInResult } from "../types";
import { useAuth, type SignInOptions, type SignUpOptions } from "./use-auth";

/**
 * 使用本地鉴权
 * @returns 本地鉴权
 */
export const useLocalAuth = createGlobalState(function <
  F extends FastAuthForm = FastAuthForm,
>(nuxtApp: NuxtApp = useNuxtApp()) {
  const auth = useAuth(nuxtApp);
  const authConfig = useModuleConfig(configKey, nuxtApp);

  const {
    token: _token,
    user: _user,
    status: _status,
    remember: _remember,
    refreshUser,
  } = auth;

  /**
   * 登录
   * @param form 登录表单
   * @param options 登录选项
   */
  async function signIn(form: F, options: SignInOptions = {}) {
    const { remember, navigate = false, navigateOptions } = options;

    try {
      _status.value.signIn = true;
      const result = shallowRef<string | LocalSignInResult | undefined>();
      await nuxtApp.callHook("fast-auth:sign-in", form, result);
      if (result.value) {
        if (typeof result.value === "string") {
          _token.value = {
            value: result.value,
            create: new Date().getTime(),
          };
          await refreshUser(result.value);
        } else {
          _token.value = {
            value: result.value.token,
            create: new Date().getTime(),
            expires: result.value.tokenExpires,
          };
          if (result.value.user) _user.value = result.value.user;
          else await refreshUser(result.value.token);
        }

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

  return { ...auth, signIn, signUp };
});
