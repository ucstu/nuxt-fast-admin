import { defineNuxtPlugin, type NuxtApp } from "#app";
import { getAuthPageFilled } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-auth:get-page", (origin, result) => {
      result.value = getAuthPageFilled(origin, nuxtApp as NuxtApp);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nuxtApp.hook("fast-auth:sign-out", async (user, token, refreshToken) => {
      if (user) user.value = undefined;
      if (token) token.value = {};
      if (refreshToken) refreshToken.value = {};
    });
  },
});
