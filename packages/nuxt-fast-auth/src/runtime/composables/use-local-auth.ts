import { getAppConfig, navigateTo } from "#imports";
import type { FsAuthForm, LocalAuthHooks } from "../types";
import {
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
interface LocalSignOptions extends NavigateOptions {
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
async function localSignIn<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: LocalSignOptions = {}
) {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const config = getAppConfig("fastAuth");
  const { getUser } = useAuth();
  const rememberRef = useRemember();

  const { remember = false, navigate = false, navigateOptions } = options;

  status.value.signIn = true;
  const authHooks = config.authHooks as LocalAuthHooks;
  try {
    const result = (await authHooks.signIn?.(form)) || null;
    if (typeof result === "string") {
      if (remember === true) {
        rememberRef.value = config.provider?.tokenExpires ?? 0;
      } else {
        rememberRef.value = remember;
      }
      token.value = result;
      await getUser(result);
      if (navigate) {
        navigateTo(
          navigate === true ? config.pages!.home! : navigate,
          navigateOptions
        );
      }
    } else if (result) {
      if (remember === true) {
        rememberRef.value =
          result.tokenExpires ?? config.provider?.tokenExpires ?? 0;
      } else {
        rememberRef.value = remember;
      }
      token.value = result.token;
      await getUser(result.token);
      if (navigate) {
        navigateTo(
          navigate === true ? config.pages!.home! : navigate,
          navigateOptions
        );
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
interface LocalSignUpOptions extends LocalSignOptions {
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
async function localSignUp<F extends FsAuthForm = FsAuthForm>(
  form: F,
  options: LocalSignUpOptions = {}
) {
  const status = useStatus();
  const config = getAppConfig("fastAuth");

  const { autoSignIn = true } = options;

  status.value.signUp = true;
  const authHooks = config.authHooks as LocalAuthHooks;
  try {
    await authHooks.signUp?.(form);
  } catch (e) {
    status.value.signUp = false;
    throw e;
  }
  status.value.signUp = false;

  if (autoSignIn) await localSignIn<F>(form, options);
}

export type UseLocalAuthRet<F extends FsAuthForm = FsAuthForm> = UseAuthRet & {
  signUp: typeof localSignUp<F>;
  signIn: typeof localSignIn<F>;
};
/**
 * 使用本地鉴权
 * @returns 本地鉴权
 */
export function useLocalAuth<
  F extends FsAuthForm = FsAuthForm
>(): UseLocalAuthRet<F> {
  return {
    ...useAuth(),
    signUp: localSignUp<F>,
    signIn: localSignIn<F>,
  };
}
