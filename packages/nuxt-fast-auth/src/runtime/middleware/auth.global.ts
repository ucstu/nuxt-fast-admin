import { abortNavigation, defineNuxtRouteMiddleware, useNuxtApp } from "#app";
import { getNuxtConfig, navigateTo, ref, shallowRef, useAuth } from "#imports";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import { cloneDeep } from "lodash-es";
import { configKey } from "../../config";
import type { useRefreshAuth } from "../composables";
import type {
  FastAuthBase,
  FastAuthMeta,
  FastAuthPage,
  FastAuthPageFilled,
  GuardOptions,
  PageHooks,
} from "../types";
import { isAuthMeta } from "../utils";

function callHook(
  name: keyof PageHooks,
  options: GuardOptions,
  nuxtApp = useNuxtApp()
) {
  const result = ref<ReturnType<typeof navigateTo>>();
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    name,
    options,
    result
  );
  return result.value;
}

export function getAuthPage(page: FastAuthPage, nuxtApp = useNuxtApp()) {
  const result = shallowRef<FastAuthPageFilled>(
    cloneDeep(page) as FastAuthPageFilled
  );

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-auth:get-page",
    page,
    result
  );

  return result.value;
}

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const _auth = useAuth();
  const nuxtApp = useNuxtApp();
  const config = getNuxtConfig(configKey);
  const runtimeConfig = getNuxtConfig(configKey, { type: "public" });

  const { user, token, getUser } = _auth;

  if (runtimeConfig.provider === "refresh") {
    const { refreshToken, refresh } = _auth as ReturnType<
      typeof useRefreshAuth
    >;
    if (!token.value && refreshToken.value) {
      await refresh();
    }
  }

  if (!user.value && token.value) {
    await getUser();
  }

  const to = getAuthPage({ to: _to }, nuxtApp);
  const from = getAuthPage({ to: _from }, nuxtApp);

  const raw = (to.auth ?? config.page.auth) as
    | RequiredDeep<FastAuthMeta>
    | FastAuthBase;
  const auth: FastAuthBase = isAuthMeta(raw) ? raw.auth : raw;
  const page: Omit<FastAuthMeta, "redirect"> & {
    redirect: Required<Exclude<FastAuthMeta["redirect"], undefined>>;
  } = {
    auth,
    redirect: {
      unAuth: isAuthMeta(raw) ? raw.redirect.unAuth : true,
      passed: isAuthMeta(raw) ? raw.redirect.passed : false,
      failed: isAuthMeta(raw) ? raw.redirect.failed : true,
    },
  };

  const options: GuardOptions = {
    to,
    from,
    page,
    user: user.value,
  };
  // 调用页面前置认证钩子
  const beforeHookResult = callHook("fast-auth:before-auth", options);
  // 如果返回值不为 null 则返回
  if (beforeHookResult !== undefined) return beforeHookResult;
  // 如果需要认证
  if (page.role || page.per) {
    // 如果未认证
    if (!token.value) {
      // 调用未认证钩子
      const hookResult = callHook("fast-auth:un-auth", options);
      // 如果返回值不为 null 则返回
      if (hookResult !== undefined) return hookResult;
      // 如果有重定向
      if (page.redirect.unAuth) {
        return navigateTo(
          page.redirect.unAuth === true ? config.signIn : page.redirect.unAuth
        );
      }
      // 如果已认证
    } else {
      const roleResult = $role(page.role as FsAuthPer);
      const perResult = $per(page.per as FsAuthPer);
      const result =
        mix === "|" ? roleResult || perResult : roleResult && perResult;
      // 如果无权限
      if (!result) {
        // 调用无权限钩子
        const hookResult = callHook("fast-auth:un-auth", options);
        // 如果返回值不为 null 则返回
        if (hookResult !== undefined) return hookResult;
        // 如果有重定向
        if (page.redirect.failed) {
          return navigateTo(
            page.redirect.failed === true ? config.home : page.redirect.failed
          );
        }
        return abortNavigation();
        // 如果有权限
      } else {
        // 调用已认证钩子
        const hookResult = callHook("fast-auth:passed", options);
        // 如果返回值不为 null 则返回
        if (hookResult !== undefined) {
          return hookResult;
        }
        // 如果有重定向
        if (page.redirect.passed) {
          return navigateTo(
            page.redirect.passed === true ? config.home : page.redirect.passed
          );
        }
      }
    }
    // 如果无需认证
  } else {
    // 调用无需认证钩子
    const hookResult = callHook("fast-auth:no-auth", options);
    // 如果返回值不为 null 则返回
    if (hookResult !== undefined) {
      return hookResult;
    }
  }
  // 调用页面后置认证钩子
  const afterHookResult = callHook("fast-auth:after-auth", options);
  // 如果返回值不为 null 则返回
  if (afterHookResult !== undefined) {
    return afterHookResult;
  }
});
