import { defineNuxtPlugin } from "#app";
import {
  computed,
  onNuxtReady,
  useAppConfig,
  useAuth,
  useRuntimeConfig,
  watchEffect,
} from "#imports";
import { useIntervalFn, watchImmediate } from "@ucstu/nuxt-fast-utils/exports";
import type { useRefreshAuth } from "../composables";
import { configKey } from "../config";
import type { ModuleConfigDefaults } from "../types";

function setTimeArrive(fn: () => void, time: number | string | Date) {
  let timer: NodeJS.Timeout | undefined;
  function start() {
    timer = setTimeout(() => {
      if (new Date().getTime() >= new Date(time).getTime()) {
        clearTimeout(timer);
        fn();
      } else {
        clearTimeout(timer);
        start();
      }
    }, Math.min(new Date(time).getTime() - new Date().getTime(), 2147483647));
  }
  start();
  return () => clearTimeout(timer);
}

export default defineNuxtPlugin({
  async setup() {
    const auth = useAuth();
    const appConfig = useAppConfig();
    const config = computed(() => appConfig[configKey] as ModuleConfigDefaults);
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
          if (!token.value) return;
          clearTimeArrive = setTimeArrive(
            signOut,
            token.value.create +
              (token.value.expires ?? config.value.provider.tokenExpires)
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
          if (!refreshToken.value) return;
          clearTimeArrive = setTimeArrive(
            signOut,
            refreshToken.value.create +
              (refreshToken.value.expires ??
                config.value.provider.refreshTokenExpires)
          );
        });

        // token 过期前刷新 token
        let clearTimeArriveToken: (() => void) | undefined;
        watchEffect(() => {
          clearTimeArriveToken?.();
          if (!token.value) return;
          clearTimeArriveToken = setTimeArrive(
            refresh,
            token.value.create +
              (token.value.expires ?? config.value.provider.tokenExpires) -
              config.value.provider.tokenRefresh
          );
        });

        // 窗口焦点刷新 token
        watchEffect(() => {
          if (config.value.provider.refreshOnWindowFocus) {
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
        () => config.value.session.refreshPeriodically
      );
      watchImmediate(
        () => config.value.session.refreshPeriodically,
        (period) => (period === 0 ? pause() : resume())
      );

      // 窗口焦点刷新用户
      watchEffect(() => {
        if (config.value.session.refreshOnWindowFocus) {
          window.addEventListener("focus", refreshUser);
        } else {
          window.removeEventListener("focus", refreshUser);
        }
      });
      // #endregion
    });
  },
});
