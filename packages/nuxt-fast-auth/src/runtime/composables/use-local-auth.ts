import { navigateTo, ref, useAppConfig, useNuxtAppBack } from "#imports";
import type {
  FsAuthConfigDefaults,
  FsAuthForm,
  LocalSignInResult,
} from "../types";
import {
  getUser,
  useAuth,
  useRemember,
  useStatus,
  useToken,
  useUser,
  type SignInOptions,
  type SignUpOptions,
} from "./use-auth";

/**
 * 登录
 * @param form 登录表单
 * @param options 登录选项
 */
export async function localSignIn<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: SignInOptions = {}
) {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const config = useAppConfig().fastAuth as FsAuthConfigDefaults;
  const nuxtApp = useNuxtAppBack();
  const rememberRef = useRemember();

  const { remember, navigate = false, navigateOptions } = options;

  status.value.signIn = true;
  try {
    const result = ref<string | LocalSignInResult | undefined>();
    await nuxtApp.callHook("fast-auth:sign-in", form, result);
    if (result.value) {
      if (typeof result.value === "string") {
        token.value = result.value;
        await getUser(result.value);
      } else {
        token.value = result.value.token;
        if (result.value.user) user.value = result.value.user;
        else await getUser(result.value.token);
      }
      if (remember !== undefined) {
        rememberRef.value = remember;
      }
      if (navigate) {
        navigateTo(navigate === true ? config.home : navigate, navigateOptions);
      }
    } else {
      token.value = null;
      user.value = null;
    }
  } catch (e) {
    status.value.signIn = false;
    throw e;
  }
  status.value.signIn = false;
}

/**
 * 注册
 * @param form 注册表单
 * @param options 注册选项
 */
export async function localSignUp<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: SignUpOptions = {}
) {
  const status = useStatus();
  const nuxtApp = useNuxtAppBack();

  const { autoSignIn = true } = options;

  status.value.signUp = true;
  try {
    await nuxtApp.callHook("fast-auth:sign-up", form);
  } catch (e) {
    status.value.signUp = false;
    throw e;
  }
  status.value.signUp = false;

  if (autoSignIn) await localSignIn<F>(form, options);
}

/**
 * 使用本地鉴权
 * @returns 本地鉴权
 */
export function useLocalAuth<F extends FsAuthForm = FsAuthForm>() {
  return {
    ...useAuth(),
    signUp: localSignUp<F>,
    signIn: localSignIn<F>,
  };
}
