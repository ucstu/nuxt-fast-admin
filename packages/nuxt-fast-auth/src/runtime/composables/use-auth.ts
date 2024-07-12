import {
  computed,
  cookieStorage,
  getNuxtConfig,
  navigateTo,
  ref,
  sessionCookieStorage,
  toValue,
  useNuxtApp,
  useNuxtConfig,
  useNuxtStorage,
  useState,
  type MaybeRefOrGetter,
} from "#imports";
import {
  createGlobalState,
  watchImmediate,
} from "@ucstu/nuxt-fast-utils/exports";
import { configKey } from "../config";
import type {
  FastAuthPer,
  FastAuthPerWrapper,
  FastAuthToken,
  FastAuthUser,
} from "../types";

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
 * 跳转选项
 * @description 跳转选项
 */
export interface NavigateOptions {
  /**
   * 自动跳转
   * @description 为 `RouteLocationRaw` 时，表示跳转到指定路由
   * @description 为 `false` 时，表示不跳转到任何路由
   * @description 为 `true` 时，表示跳转默认路径
   * @default false
   */
  navigate?: boolean | Parameters<typeof navigateTo>[0];
  /**
   * 跳转选项
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
 * 获取用户权限|角色列表
 * @param user 用户信息
 * @param type 类型
 * @param nuxtApp Nuxt 应用
 * @returns 用户权限|角色列表
 */
function getPers(
  user: FastAuthUser | null | undefined,
  type: "permissions" | "roles" = "permissions",
  nuxtApp = useNuxtApp(),
) {
  const result = ref<Array<FastAuthPer>>([]);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    `fast-auth:get-${type}`,
    user,
    result,
  );
  return result.value;
}

/**
 * 使用认证
 * @returns 认证
 */
export const useAuth = createGlobalState(
  <S extends AuthStatus = AuthStatus>(nuxtApp = useNuxtApp()) => {
    const config = useNuxtConfig(configKey);
    const fastUtilsConfig = getNuxtConfig("fastUtils", { type: "public" });

    const _user = useState<FastAuthUser | undefined>("fast-auth:user");
    const _remember = useNuxtStorage<boolean>("fast-auth:remember", false);
    const _token = useNuxtStorage<FastAuthToken | undefined>(
      "fast-auth:token",
      undefined,
      () =>
        fastUtilsConfig.ssr
          ? _remember.value
            ? cookieStorage
            : sessionCookieStorage
          : _remember.value
            ? localStorage
            : sessionStorage,
    );
    const _status = useState<S>(
      "fast-auth:status",
      () =>
        ({
          signIn: false,
          signUp: false,
          signOut: false,
          getUser: false,
          authed: false,
        }) as S,
    );
    const roles = computed(() =>
      getPers(_user.value, "roles", nuxtApp).map(
        (item) => ({ type: "role", value: item }) as FastAuthPerWrapper,
      ),
    );
    const permissions = computed(() =>
      getPers(_user.value, "permissions", nuxtApp).map(
        (item) => ({ type: "per", value: item }) as FastAuthPerWrapper,
      ),
    );

    watchImmediate(_user, (user) => (_status.value.authed = !!user));

    /**
     * 获取用户信息
     * @param token 令牌
     */
    async function getUser(
      token: MaybeRefOrGetter<string | undefined> = _token.value?.value,
    ) {
      try {
        _status.value.getUser = true;
        await nuxtApp.callHook("fast-auth:get-user", toValue(token), _user);
      } finally {
        _status.value.getUser = false;
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
          undefined as any,
        );
        if (navigate) {
          await navigateTo(
            navigate === true ? config.value.signIn : navigate,
            options.navigateOptions,
          );
        }
      } finally {
        _status.value.signOut = false;
      }
    }

    return {
      user: _user,
      token: _token,
      status: _status,
      remember: _remember,
      signOut,
      getUser,
      permissions,
      roles,
    };
  },
);
