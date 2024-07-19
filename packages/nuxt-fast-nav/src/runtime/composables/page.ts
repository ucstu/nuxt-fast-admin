import type { NuxtApp } from "#app";
import {
  $useRouter,
  computed,
  createNuxtGlobalState,
  shallowRef,
  toEqual,
  useNuxtApp,
} from "#imports";
import { extendRef, reactify } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import type { FastNavPage, FastNavPageFilled } from "../types";

export function getNavPages(
  nuxtApp: NuxtApp = useNuxtApp()
): Array<FastNavPage | FastNavPageFilled> {
  const result = shallowRef<Array<FastNavPage | FastNavPageFilled>>([]);

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-pages",
    result
  );

  return result.value;
}

export function getNavPage(page: FastNavPage, nuxtApp: NuxtApp = useNuxtApp()) {
  const result = shallowRef<FastNavPageFilled | undefined>(
    page as FastNavPageFilled
  );

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-page",
    page,
    extendRef(result, {
      remove() {
        result.value = undefined;
      },
      merge(value: Partial<FastNavPage | FastNavPageFilled>) {
        result.value = defu(value, result.value) as FastNavPageFilled;
      },
    })
  );

  return result.value;
}

export const useNavPages = createNuxtGlobalState(function (
  nuxtApp: NuxtApp = useNuxtApp()
) {
  const { currentRoute } = $useRouter(nuxtApp);

  const result = computed(() =>
    getNavPages(nuxtApp)
      .map((page) => getNavPage(page, nuxtApp))
      .filter((page) => page !== undefined)
  );

  /**
   * 获取页面
   * @param to 页面路由
   * @returns 页面
   */
  function getPage(to: FastNavPageFilled["to"] = currentRoute.value) {
    return result.value.find((page) => toEqual(to, page.to, nuxtApp));
  }

  const usePage = reactify(getPage);

  return extendRef(result, {
    current: usePage(),
    getPage,
    usePage,
  });
});
