import { abortNavigation, defineNuxtRouteMiddleware, useNuxtApp } from "#app";
import { getNuxtConfig, navigateTo, shallowRef, useAuth } from "#imports";
import { cloneDeep } from "lodash-es";
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

export function getAuthPage(page: FastAuthPage, nuxtApp = useNuxtApp()) {
  const result = shallowRef<FastAuthPageFilled>(
    cloneDeep(page) as FastAuthPageFilled,
  );

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-auth:get-page",
    page,
    result,
  );

  return result.value;
}

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const _auth = useAuth();
  const nuxtApp = useNuxtApp();
  const config = getNuxtConfig(configKey);
  const runtimeConfig = getNuxtConfig(configKey, { type: "public" });

  const { status, user, token, getUser } = _auth;

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
    hookResult = callHook("fast-auth:not-logged", options);
    if (hookResult !== HookNull) return hookResult;

    if (to.auth.redirect.unAuth) {
      return navigateTo(
        to.auth.redirect.unAuth === true
          ? config.signIn
          : to.auth.redirect.unAuth,
      );
    }
  } else {
    if ($auth(to.auth.auth)) {
      hookResult = callHook("fast-auth:auth-passed", options);
      if (hookResult !== HookNull) return hookResult;

      if (to.auth.redirect.passed) {
        return navigateTo(
          to.auth.redirect.passed === true
            ? config.home
            : to.auth.redirect.passed,
        );
      }
    } else {
      hookResult = callHook("fast-auth:auth-failed", options);
      if (hookResult !== HookNull) return hookResult;

      if (to.auth.redirect.failed) {
        return navigateTo(
          to.auth.redirect.failed === true
            ? config.home
            : to.auth.redirect.failed,
        );
      }
      return abortNavigation();
    }
  }

  hookResult = callHook("fast-auth:after-auth", options);
  if (hookResult !== HookNull) return hookResult;
});
