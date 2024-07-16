import { defineNuxtPlugin } from "#app";
import { getAuthPageFilled } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-auth:get-page", (input, result) => {
      result.value = getAuthPageFilled(input);
    });

    // @ts-expect-error
    nuxtApp.hook("fast-auth:sign-out", async (user, token, refreshToken) => {
      if (user) user.value = undefined;
      if (token) token.value = undefined;
      if (refreshToken) refreshToken.value = undefined;
    });
  },
});
