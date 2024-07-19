import type { NuxtApp } from "#app";
import { $useRouter, fixTo, useModuleConfig, useNuxtApp } from "#imports";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { configKey } from "../config";
import type {
  FastAuthBase,
  FastAuthMeta,
  FastAuthPage,
  FastAuthPageFilled,
} from "../types";
import { isAuthMeta } from "./basic";

export function getAuthPageFilled(
  page: FastAuthPage,
  nuxtApp: NuxtApp = useNuxtApp()
): FastAuthPageFilled {
  const router = $useRouter(nuxtApp);
  const authConfig = useModuleConfig(configKey, nuxtApp);

  const to = router.resolve(fixTo(page.to));
  const raw = to?.meta.auth as FastAuthMeta | FastAuthBase | undefined;
  const rawAuth = isAuthMeta(raw) ? raw.auth : raw;
  const rawRedirect = isAuthMeta(raw) ? raw.redirect : undefined;

  const store = authConfig.value.page.auth;
  const storeAuth = isAuthMeta(store) ? store.auth : store;
  const storeRedirect = isAuthMeta(store) ? store.redirect : undefined;

  const auth = rawAuth ?? storeAuth;
  const redirect = defu(rawRedirect, storeRedirect) as RequiredDeep<
    FastAuthMeta["redirect"]
  >;

  return {
    to: page.to,
    auth: {
      auth,
      redirect,
    },
  };
}
