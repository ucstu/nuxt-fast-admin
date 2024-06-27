import { defineNuxtRouteMiddleware } from "#app";
import { getFuConfig, navigateTo, useAuth, useRuntimeConfig } from "#imports";
import {
  authDirect,
  useToken,
  type UseLocalAuthRet,
  type UseRefreshAuthRet,
} from "../composables";
import type { FsAuthMeta, FsAuthPage, GuardOptions } from "../types";
import { isFsAuthPage } from "../utils";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = getFuConfig("fastAuth");
  const runtimeConfig = useRuntimeConfig();
  const token = useToken();
  const refreshToken = useRefreshToken();
  const user = useUser();
  const { getUser, refresh } = useAuth() as UseRefreshAuthRet & UseLocalAuthRet;

  if (runtimeConfig.public.fastAuth.provider.type === "refresh") {
    if (!token.value && refreshToken.value) {
      await refresh();
    }
  }
  if (!user.value && token.value) {
    await getUser();
  }

  const raw = (to.meta.auth ?? config.pages!.authMeta) as
    | FsAuthPage
    | FsAuthMeta;
  const auth: FsAuthMeta = isFsAuthPage(raw) ? raw.auth : raw;
  const page: Omit<FsAuthPage, "redirect"> & {
    redirect: Required<Exclude<FsAuthPage["redirect"], undefined>>;
  } = {
    redirect: {
      unAuth: isFsAuthPage(raw) ? raw.redirect?.unAuth ?? true : true,
      passed: isFsAuthPage(raw) ? raw.redirect?.passed ?? false : false,
      failed: isFsAuthPage(raw) ? raw.redirect?.failed ?? true : true,
    },
    auth,
  };

  const options: GuardOptions = { to, from, page, user: user.value };
  // 调用页面前置认证钩子
  const beforeHookResult = await config.pageHooks!.beforeAuth?.(options);
  // 如果定义了钩子并且返回值不为 null 则返回
  if (config.pageHooks!.beforeAuth && beforeHookResult !== null) {
    return beforeHookResult;
  }
  // 如果需要认证
  if (page.auth) {
    // 如果未认证
    if (!token.value) {
      // 调用未认证钩子
      const hookResult = await config.pageHooks!.unAuth?.(options);
      // 如果定义了钩子并且返回值不为 null 则返回
      if (config.pageHooks!.unAuth && hookResult !== null) {
        return hookResult;
      }
      // 如果有重定向
      if (page.redirect.unAuth) {
        return navigateTo(
          page.redirect.unAuth === true
            ? config.pages!.signIn!
            : page.redirect.unAuth
        );
      }
      // 如果已认证
    } else {
      // 如果无权限
      if (!authDirect(page.auth)) {
        // 调用无权限钩子
        const hookResult = await config.pageHooks!.failed?.(options);
        // 如果定义了钩子并且返回值不为 null 则返回
        if (config.pageHooks!.failed && hookResult !== null) {
          return hookResult;
        }
        // 如果有重定向
        if (page.redirect.failed) {
          return navigateTo(
            page.redirect.failed === true
              ? config.pages!.home!
              : page.redirect.failed
          );
        }
        // 如果有权限
      } else {
        // 调用已认证钩子
        const hookResult = await config.pageHooks!.passed?.(options);
        // 如果定义了钩子并且返回值不为 null 则返回
        if (config.pageHooks!.passed && hookResult !== null) {
          return hookResult;
        }
        // 如果有重定向
        if (page.redirect.passed) {
          return navigateTo(
            page.redirect.passed === true
              ? config.pages!.home!
              : page.redirect.passed
          );
        }
      }
    }
    // 如果无需认证
  } else {
    // 调用无需认证钩子
    const hookResult = await config.pageHooks!.noAuth?.(options);
    // 如果定义了钩子并且返回值不为 null 则返回
    if (config.pageHooks!.noAuth && hookResult !== null) {
      return hookResult;
    }
  }
  // 调用页面后置认证钩子
  const afterHookResult = await config.pageHooks!.afterAuth?.(options);
  // 如果定义了钩子并且返回值不为 null 则返回
  if (config.pageHooks!.afterAuth && afterHookResult !== null) {
    return afterHookResult;
  }
});
