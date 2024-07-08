import { abortNavigation, defineNuxtRouteMiddleware } from "#app";
import {
  getRouteMeta,
  navigateTo,
  ref,
  useAppConfig,
  useNuxtAppBack,
  useRuntimeConfig,
} from "#imports";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/types";
import {
  $per,
  $role,
  getUser,
  refresh,
  useRefreshToken,
  useStatus,
  useToken,
  useUser,
} from "../composables";
import type {
  FsAuthConfigDefaults,
  FsAuthMeta,
  FsAuthPage,
  FsAuthPer,
  GuardOptions,
  PageHooks,
} from "../types";
import { isFsAuthPage } from "../utils";

function callHook(
  name: keyof PageHooks,
  options: GuardOptions,
  nuxtApp = useNuxtAppBack()
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

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const user = useUser();
  const token = useToken();
  const status = useStatus();
  const refreshToken = useRefreshToken();
  const runtimeConfig = useRuntimeConfig();
  const config = useAppConfig().fastAuth as FsAuthConfigDefaults;

  if (runtimeConfig.public.fastAuth.provider.type === "refresh") {
    if (!status.value.authed && refreshToken.value) {
      await refresh();
    }
  }
  if (!user.value && status.value.authed) {
    await getUser();
  }

  const to = { ..._to, meta: getRouteMeta(_to.path) };
  const from = { ..._from, meta: getRouteMeta(_from.path) };

  const raw = (to.meta.auth ?? config.page.auth) as
    | RequiredDeep<FsAuthPage>
    | FsAuthMeta;
  const role: FsAuthMeta = isFsAuthPage(raw) ? raw.role : raw;
  const per: FsAuthMeta = isFsAuthPage(raw) ? raw.per : raw;
  const mix: "|" | "&" = isFsAuthPage(raw) ? raw.mix : "|";
  const page: Omit<FsAuthPage, "redirect"> & {
    redirect: Required<Exclude<FsAuthPage["redirect"], undefined>>;
  } = {
    redirect: {
      unAuth: isFsAuthPage(raw) ? raw.redirect.unAuth : true,
      passed: isFsAuthPage(raw) ? raw.redirect.passed : false,
      failed: isFsAuthPage(raw) ? raw.redirect.failed : true,
    },
    role,
    per,
    mix,
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
          page.redirect.unAuth === true ? config.signIn : page.redirect.unAuth,
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
            page.redirect.failed === true ? config.home : page.redirect.failed,
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
            page.redirect.passed === true ? config.home : page.redirect.passed,
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
