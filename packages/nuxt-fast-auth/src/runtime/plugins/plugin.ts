import { defineNuxtPlugin } from "#app";
import { useAppConfig, useRuntimeConfig } from "#imports";
import { watchImmediate } from "@ucstu/nuxt-fast-utils/exports";
import {
  getUser,
  refresh,
  useRefreshToken,
  useRemember,
  useStatus,
  useToken,
  useUser,
} from "../composables";
import type { FsAuthConfigDefaults } from "../types";

export default defineNuxtPlugin({
  async setup() {
    const user = useUser();
    const token = useToken();
    const status = useStatus();
    const remember = useRemember();
    const refreshToken = useRefreshToken();
    const runtimeConfig = useRuntimeConfig();
    const config = useAppConfig().fastAuth as FsAuthConfigDefaults;

    watchImmediate(token, (value) => (status.value.authed = Boolean(value)));

    if (runtimeConfig.public.fastAuth.provider.type === "refresh") {
      if (!status.value.authed && refreshToken.value) {
        await refresh();
      }
    }
    if (!user.value && status.value.authed) {
      await getUser();
    }

    if (import.meta.client) {
      // 如果配置了自动定时刷新用户
      if (config.session.refreshPeriodically) {
        setInterval(() => {
          if (token.value) getUser();
        }, config.session.refreshPeriodically);
      }
      // 如果配置了窗口焦点时刷新用户
      if (config.session.refreshOnWindowFocus) {
        window.addEventListener("focus", () => {
          if (token.value) getUser();
        });
      }
      // 如果使用了刷新令牌
      if (runtimeConfig.public.fastAuth.provider.type === "refresh") {
        if (typeof remember.value === "boolean") {
          if (remember.value && config.provider.refreshTokenExpires)
            setTimeout(() => refresh, config.provider.refreshTokenExpires / 2);
        } else {
          setTimeout(() => refresh, remember.value / 2);
        }
      }
    }
  },
});
