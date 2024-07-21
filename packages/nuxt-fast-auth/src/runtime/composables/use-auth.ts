import type { NuxtApp } from "#app";
import {
  $useRuntimeConfig,
  cookieStorage,
  navigateTo,
  ref,
  sessionCookieStorage,
  toValue,
  useModuleConfig,
  useNuxtApp,
  useNuxtStorage,
  useState,
  type MaybeRefOrGetter,
} from "#imports";
import {
  computedEager,
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
  /**
   * 当前角色
   */
  role?: FastAuthPer | null | undefined;
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
 * 获取用户角色列表
 * @param user 用户信息
 * @param nuxtApp Nuxt 应用
 * @returns 用户角色列表
 */
function getRoles(
  user: FastAuthUser | null | undefined,
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  const result = ref<Array<FastAuthPer>>([]);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    "fast-auth:get-roles",
    user,
    result,
  );
  return result.value;
}

/**
 * 获取用户权限列表
 * @param user 用户信息
 * @param role 用户角色
 * @param nuxtApp Nuxt 应用
 * @returns 用户权限列表
 */
function getPermissions(
  user: FastAuthUser | null | undefined,
  role: FastAuthPer | null | undefined,
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  const result = ref<Array<FastAuthPer>>([]);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    "fast-auth:get-permissions",
    user,
    role,
    result,
  );
  return result.value;
}

/**
 * 使用认证
 * @returns 认证
 */
export const useAuth = createGlobalState(function <
  S extends AuthStatus = AuthStatus,
>(nuxtApp: NuxtApp = useNuxtApp()) {
  const authConfig = useModuleConfig(configKey, nuxtApp);
  const fastUtilsConfig = $useRuntimeConfig(nuxtApp).public.fastUtils;

  const _user = useState<FastAuthUser | undefined>("fast-auth:user");
  const _remember = useNuxtStorage<boolean>(
    "fast-auth:remember",
    false,
    undefined,
    { nuxtApp },
  );
  const _token = useNuxtStorage<FastAuthToken>(
    "fast-auth:token",
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
  const _status = useState<S>(
    "fast-auth:status",
    () =>
      ({
        signIn: false,
        signUp: false,
        signOut: false,
        getUser: false,
        authed: false,
        role: null,
      }) as S,
  );
  const roles = computedEager(() =>
    getRoles(_user.value, nuxtApp).map(
      (item) => ({ type: "role", value: item }) as FastAuthPerWrapper,
    ),
  );
  const permissions = computedEager(() =>
    getPermissions(_user.value, _status.value.role, nuxtApp).map(
      (item) => ({ type: "per", value: item }) as FastAuthPerWrapper,
    ),
  );

  watchImmediate(_user, (user) => (_status.value.authed = !!user));

  /**
   * 刷新用户信息
   * @param token 令牌
   */
  async function refreshUser(
    token: MaybeRefOrGetter<string | undefined> = _token.value.value,
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
      // @ts-ignore
      await nuxtApp.callHook("fast-auth:sign-out", _user, _token);
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
   * 改变角色
   * @param role 角色
   */
  function changeRole(role: FastAuthPer | null | undefined) {
    _status.value.role = role;
  }

  return {
    user: _user,
    token: _token,
    status: _status,
    remember: _remember,
    signOut,
    refreshUser,
    changeRole,
    permissions,
    roles,
  };
});
