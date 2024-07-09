import {
  computed,
  createNuxtGlobalState,
  shallowRef,
  toValue,
  useNuxtApp,
  useRouter,
  type MaybeRefOrGetter,
} from "#imports";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import type { FastNavPage, FastNavPageFilled } from "../types";
import { toEqual } from "../utils/basic";

export function getNavPages(nuxtApp = useNuxtApp()) {
  const result = shallowRef(Array<FastNavPage | FastNavPageFilled>());
  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-pages",
    result
  );
  return result.value;
}

export function getNavPage(page: FastNavPage, nuxtApp = useNuxtApp()) {
  const result = shallowRef<FastNavPageFilled>(page as FastNavPageFilled);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-page",
    page,
    result
  );
  return result.value;
}

export const useNavPages = createNuxtGlobalState(() => {
  const nuxtApp = useNuxtApp();
  const { currentRoute } = useRouter();

  const result = computed(() =>
    getNavPages(nuxtApp)
      .map((page) => getNavPage(page, nuxtApp))
      .filter((page) => page !== undefined)
  );

  function getPage(to?: FastNavPageFilled["to"]) {
    return result.value.find((page) =>
      toEqual(page.to, to ?? currentRoute.value)
    );
  }

  function usePage(to?: MaybeRefOrGetter<FastNavPageFilled["to"]>) {
    return computed(() => getPage(toValue(to)));
  }

  return extendRef(result, {
    current: usePage(),
    getPage,
    usePage,
  });
});
