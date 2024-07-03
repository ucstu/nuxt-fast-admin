import { navigateTo, ref, useAppConfig, useFsNuxtApp } from "#imports";
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
  type NavigateOptions,
} from "./use-auth";

/**
 * 登录选项
 * @description 登录选项
 */
export interface LocalSignOptions extends NavigateOptions {
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
export async function localSignIn<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: LocalSignOptions = {},
) {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const config = useAppConfig().fastAuth as FsAuthConfigDefaults;
  const nuxtApp = useFsNuxtApp();
  const rememberRef = useRemember();

  const { remember = false, navigate = false, navigateOptions } = options;

  status.value.signIn = true;
  try {
    const result = ref<string | LocalSignInResult | undefined>();
    await nuxtApp.callHook("fast-auth:sign-in", form, result);
    if (typeof result.value === "string") {
      if (remember === true) {
        rememberRef.value = config.provider.tokenExpires;
      } else {
        rememberRef.value = remember;
      }
      token.value = result.value;
      await getUser(result.value);
      if (navigate) {
        navigateTo(navigate === true ? config.home : navigate, navigateOptions);
      }
    } else if (result.value) {
      if (remember === true) {
        rememberRef.value =
          result.value.tokenExpires ?? config.provider.tokenExpires;
      } else {
        rememberRef.value = remember;
      }
      token.value = result.value.token;
      if (result.value.user) user.value = result.value.user;
      else await getUser(result.value.token);

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
 * 注册选项
 * @description 注册选项
 * @description 注意：跳转配置仅针对自动登录成功后有效
 */
export interface LocalSignUpOptions extends LocalSignOptions {
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
export async function localSignUp<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: LocalSignUpOptions = {},
) {
  const status = useStatus();
  const nuxtApp = useFsNuxtApp();

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
