import { defineNuxtPlugin } from "#app";
import { getAuthPageFilled, useAppConfig, useAuth, useRouter } from "#imports";
import type { FastAuthPage } from "@ucstu/nuxt-fast-auth/types";
import type { FastNavPageFilled } from "@ucstu/nuxt-fast-nav/types";

declare module "@ucstu/nuxt-fast-nav/types" {
  interface FastNavPage extends Omit<FastAuthPage, "to"> {}
}

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const { signOut } = useAuth();
    nuxtApp.hook("fast-nav:get-page", (input, result) => {
      if (!result.value) result.value = input as FastNavPageFilled;
      result.value.auth = getAuthPageFilled(
        input,
        useAppConfig(),
        useRouter()
      ).auth;
    });
    nuxtApp.hook(
      "fast-admin:layout-default-header-dropdown-select",
      async (index, option) => {
        if (option.key === "logout") {
          await signOut({ navigate: true });
        }
      }
    );
  },
});
