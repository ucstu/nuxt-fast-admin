import { defineNuxtPlugin } from "#app";
import {
  onNuxtReady,
  useAuth,
  useModuleConfig,
  useRuntimeConfig,
  watchEffect,
} from "#imports";
import { useIntervalFn, watchImmediate } from "@ucstu/nuxt-fast-utils/exports";
import type { useRefreshAuth } from "../composables";
import { configKey } from "../config";

function setTimeArrive(fn: () => void, time: number | string | Date) {
  let timer: NodeJS.Timeout | undefined;
  function start() {
    timer = setTimeout(
      () => {
        if (new Date().getTime() >= new Date(time).getTime()) {
          clearTimeout(timer);
          fn();
        } else {
          clearTimeout(timer);
          start();
        }
      },
      Math.min(new Date(time).getTime() - new Date().getTime(), 2147483647),
    );
  }
  start();
  return () => clearTimeout(timer);
}

export default defineNuxtPlugin({
  async setup() {
    const auth = useAuth();
    const authConfig = useModuleConfig(configKey);
    const runtimeConfig = useRuntimeConfig().public[configKey];

    const { user, token, refreshUser, signOut } = auth;

    if (runtimeConfig.provider === "refresh") {
      const { refreshToken, refresh } = auth as ReturnType<
        typeof useRefreshAuth
      >;
      if (!token.value && refreshToken.value) {
        await refresh();
      }
    }

    if (!user.value && token.value) {
      await refreshUser();
    }

    onNuxtReady(() => {
      // #region 刷新 token
      // 如果使用了本地模式
      if (runtimeConfig.provider === "local") {
        // token 过期退出登录
        let clearTimeArrive: (() => void) | undefined;
        watchEffect(() => {
          clearTimeArrive?.();
          if (!token.value.create) return;
          clearTimeArrive = setTimeArrive(
            signOut,
            token.value.create +
              (token.value.expires ?? authConfig.value.provider.tokenExpires),
          );
        });
      }

      // 如果使用了刷新令牌模式
      if (runtimeConfig.provider === "refresh") {
        const { refreshToken, refresh } = auth as ReturnType<
          typeof useRefreshAuth
        >;
        // refreshToken 过期退出登录
        let clearTimeArrive: (() => void) | undefined;
        watchEffect(() => {
          clearTimeArrive?.();
          if (!refreshToken.value.create) return;
          clearTimeArrive = setTimeArrive(
            signOut,
            refreshToken.value.create +
              (refreshToken.value.expires ??
                authConfig.value.provider.refreshTokenExpires),
          );
        });

        // token 过期前刷新 token
        let clearTimeArriveToken: (() => void) | undefined;
        watchEffect(() => {
          clearTimeArriveToken?.();
          if (!token.value.create) return;
          clearTimeArriveToken = setTimeArrive(
            refresh,
            token.value.create +
              (token.value.expires ?? authConfig.value.provider.tokenExpires) -
              authConfig.value.provider.tokenRefresh,
          );
        });

        // 窗口焦点刷新 token
        watchEffect(() => {
          if (authConfig.value.provider.refreshOnWindowFocus) {
            window.addEventListener("focus", () => refresh());
          } else {
            window.removeEventListener("focus", () => refresh());
          }
        });
      }
      // #endregion

      // #region 刷新用户
      function refreshUser() {
        if (token.value) refreshUser();
      }

      // 定时刷新用户
      const { pause, resume } = useIntervalFn(
        refreshUser,
        () => authConfig.value.session.refreshPeriodically,
      );
      watchImmediate(
        () => authConfig.value.session.refreshPeriodically,
        (period) => (period === 0 ? pause() : resume()),
      );

      // 窗口焦点刷新用户
      watchEffect(() => {
        if (authConfig.value.session.refreshOnWindowFocus) {
          window.addEventListener("focus", refreshUser);
        } else {
          window.removeEventListener("focus", refreshUser);
        }
      });
      // #endregion
    });
  },
});
