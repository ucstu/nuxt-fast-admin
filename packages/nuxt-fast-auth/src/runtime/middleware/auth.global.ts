import { defineNuxtRouteMiddleware, type NuxtApp } from "#app";
import {
  getModuleConfig,
  getToPath,
  navigateTo,
  resolveTo,
  shallowRef,
  useAuth,
  useNuxtApp,
  useRuntimeConfig,
} from "#imports";
import type { ShallowRef } from "vue-demi";
import { $auth, type useRefreshAuth } from "../composables";
import { configKey } from "../config";
import type {
  FastAuthPage,
  FastAuthPageFilled,
  GuardOptions,
  PageHooks,
} from "../types";

const HookNull = Symbol("HookNull");

function callHook(
  name: keyof PageHooks,
  options: GuardOptions,
  nuxtApp = useNuxtApp(),
) {
  const result = shallowRef<ReturnType<typeof navigateTo> | typeof HookNull>(
    HookNull,
  );
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    name,
    options,
    result as ShallowRef<ReturnType<typeof navigateTo> | undefined>,
  );
  return result.value;
}

function getAuthPageFilled(
  page: FastAuthPage,
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  const result = shallowRef<FastAuthPageFilled>(page as FastAuthPageFilled);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    "fast-auth:get-page",
    page,
    result,
  );
  return result.value;
}

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const _auth = useAuth();
  const authConfig = getModuleConfig(configKey);
  const runtimeConfig = useRuntimeConfig().public[configKey];

  const { status, user, token, refreshUser } = _auth;

  if (runtimeConfig.provider === "refresh") {
    const { refreshToken, refresh } = _auth as ReturnType<
      typeof useRefreshAuth
    >;
    if (!token.value && refreshToken.value) {
      await refresh();
    }
  }

  if (!user.value && token.value) {
    await refreshUser();
  }

  const to = getAuthPageFilled({ to: _to });
  const from = getAuthPageFilled({ to: _from });

  const options: GuardOptions = {
    to,
    from,
    user: user.value,
  };

  let hookResult = callHook("fast-auth:before-auth", options);
  if (hookResult !== HookNull) return hookResult;

  if (!to.auth.auth) {
    hookResult = callHook("fast-auth:auth-through", options);
    if (hookResult !== HookNull) return hookResult;
    return;
  }

  if (!status.value.authed) {
    hookResult = callHook("fast-auth:auth-anonymous", options);
    if (hookResult !== HookNull) return hookResult;

    if (to.auth.redirect.anonymous) {
      const signIn = resolveTo(authConfig.signIn);
      signIn.query ??= {};
      signIn.query.callback = getToPath(_to);
      return navigateTo(
        to.auth.redirect.anonymous === true
          ? signIn
          : to.auth.redirect.anonymous,
      );
    }
  } else {
    if ($auth(to.auth.auth)) {
      hookResult = callHook("fast-auth:auth-passed", options);
      if (hookResult !== HookNull) return hookResult;

      if (to.auth.redirect.passed) {
        return navigateTo(
          to.auth.redirect.passed === true
            ? authConfig.home
            : to.auth.redirect.passed,
        );
      }
    } else {
      hookResult = callHook("fast-auth:auth-failed", options);
      if (hookResult !== HookNull) return hookResult;

      if (to.auth.redirect.failed) {
        return navigateTo(
          to.auth.redirect.failed === true
            ? authConfig.home
            : to.auth.redirect.failed,
        );
      }
    }
  }

  hookResult = callHook("fast-auth:after-auth", options);
  if (hookResult !== HookNull) return hookResult;
});
