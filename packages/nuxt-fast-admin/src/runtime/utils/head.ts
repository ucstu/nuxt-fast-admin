import type { NuxtApp } from "#app";
import { shallowRef, useNuxtApp } from "#imports";
import type { FastNavPageFilled } from "@ucstu/nuxt-fast-nav/types";

export function getAppHeadTitle(
  page: FastNavPageFilled | undefined,
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  const result = shallowRef<string>("");

  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    "fast-admin:get-app-head-title",
    page,
    result,
  );

  return result.value;
}
