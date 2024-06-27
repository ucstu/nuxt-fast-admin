import { defineNuxtPlugin } from "#app";
import { useAuth, useRuntimeConfig } from "#imports";
import {
  authDirect,
  useRefreshAuth,
  type UseLocalAuthRet,
  type UseRefreshAuthRet,
} from "../composables";
import type { FsAuthMeta } from "../types";

declare module "vue" {
  interface ComponentCustomProperties {
    /**
     * 鉴权
     * @param needs 需要的权限
     * @returns 是否拥有权限
     * @example $auth("admin") // 是否拥有 admin 权限
     * @example $auth("admin", "user") // 是否拥有 admin 和 user 权限
     * @example $auth("|", "user", "admin") // 是否拥有 user 或 admin 权限
     * @example $auth("!", "user", "admin") // 是否没有 user 和 admin 权限
     * @example $auth("|", ["user", "admin"], "all") // 是否 (同时拥有 user 和 admin 权限) 或 具有 all 权限
     */
    $auth: (
      ...needs: FsAuthMeta[] | ["|", ...FsAuthMeta[]] | ["!", ...FsAuthMeta[]]
    ) => boolean;
  }
}

export default defineNuxtPlugin({
  async setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig();
    const config = getFuConfig("fastAuth");
    const { token, refreshToken, user, remember, getUser, refresh } =
      useAuth() as UseRefreshAuthRet & UseLocalAuthRet;

    if (runtimeConfig.public.fastAuth.provider.type === "refresh") {
      if (!token.value && refreshToken.value) {
        await refresh();
      }
    }
    if (!user.value && token.value) {
      await getUser();
    }

    nuxtApp.vueApp.config.globalProperties.$auth = authDirect;

    if (import.meta.client) {
      // 如果配置了自动定时刷新用户
      if (config.session!.refreshPeriodically) {
        setInterval(() => {
          if (token.value) getUser();
        }, config.session!.refreshPeriodically);
      }
      // 如果配置了窗口焦点时刷新用户
      if (config.session!.refreshOnWindowFocus) {
        window.addEventListener("focus", () => {
          if (token.value) getUser();
        });
      }
      // 如果使用了刷新令牌
      if (runtimeConfig.public.fastAuth.provider.type === "refresh") {
        const { refresh } = useRefreshAuth();
        if (typeof remember.value === "boolean") {
          if (remember.value && config.provider!.refreshTokenExpires)
            setTimeout(() => refresh, config.provider!.refreshTokenExpires / 2);
        } else {
          setTimeout(() => refresh, remember.value / 2);
        }
      }
    }
  },
});
