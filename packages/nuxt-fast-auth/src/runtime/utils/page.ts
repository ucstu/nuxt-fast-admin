import { useRouter } from "#app";
import { computed, useAppConfig } from "#imports";
import type { Router } from "#vue-router";
import type { AppConfig } from "@nuxt/schema";
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

export function getAuthPageFilled(
  page: FastAuthPage,
  appConfig: AppConfig = useAppConfig(),
  router: Router = useRouter()
): FastAuthPageFilled {
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
