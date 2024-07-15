import { defineNuxtPlugin } from "#app";
import { computed, useAppConfig, useRouter } from "#imports";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { configKey } from "../config";
import type {
  FastAuthBase,
  FastAuthMeta,
  ModuleConfigDefaults,
} from "../types";
import { isAuthMeta } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const router = useRouter();
    const appConfig = useAppConfig();
    const config = computed(() => appConfig[configKey] as ModuleConfigDefaults);

    nuxtApp.hook("fast-auth:get-page", (input, result) => {
      const raw = router.resolve(input.to).meta.auth as
        | FastAuthMeta
        | FastAuthBase
        | undefined;
      const rawAuth = isAuthMeta(raw) ? raw.auth : raw;
      const rawRedirect = isAuthMeta(raw) ? raw.redirect : undefined;

      const store = config.value.page.auth;
      const storeAuth = isAuthMeta(store) ? store.auth : store;
      const storeRedirect = isAuthMeta(store) ? store.redirect : undefined;

      const auth = rawAuth ?? storeAuth;
      const redirect = defu(rawRedirect, storeRedirect) as RequiredDeep<
        FastAuthMeta["redirect"]
      >;

      result.value.auth = {
        auth,
        redirect,
      };
    });
  },
});
