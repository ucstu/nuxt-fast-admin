import { useRouter } from "#app";
import { $auth, computed, useAppConfig } from "#imports";
import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { configKey } from "../config";
import type {
  FastAuthBase,
  FastAuthMeta,
  FastAuthPage,
  FastAuthPageFilled,
  ModuleConfigDefaults,
} from "../types";
import { isAuthMeta } from "./basic";

export function getAuthPageFilled(page: FastAuthPage): FastAuthPageFilled {
  const router = useRouter();
  const appConfig = useAppConfig();
  const config = computed(() => appConfig[configKey] as ModuleConfigDefaults);

  const raw = router.resolve(page.to).meta.auth as
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

  return {
    to: page.to,
    auth: {
      auth,
      redirect,
    },
  };
}

export function authPage(page: FastAuthPage): boolean {
  const filled = getAuthPageFilled(page);
  const auth = isAuthMeta(filled.auth) ? filled.auth.auth : filled.auth;
  return $auth(auth);
}
