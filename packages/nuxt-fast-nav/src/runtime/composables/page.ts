import {
  createNuxtGlobalState,
  shallowRef,
  useNuxtApp,
  useRouter,
} from "#imports";
import {
  computedEager,
  extendRef,
  reactify,
} from "@ucstu/nuxt-fast-utils/exports";
import { cloneDeep } from "lodash-es";
import type { FastNavPage, FastNavPageFilled } from "../types";
import { toEqual } from "../utils/basic";

export function getNavPages(nuxtApp = useNuxtApp()) {
  const result = shallowRef<Array<FastNavPage | FastNavPageFilled>>([]);

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-pages",
    result,
  );

  return result.value;
}

export function getNavPage(page: FastNavPage, nuxtApp = useNuxtApp()) {
  const result = shallowRef<FastNavPageFilled>(
    cloneDeep(page) as FastNavPageFilled,
  );

  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:get-page",
    page,
    result,
  );

  return result.value;
}

export const useNavPages = createNuxtGlobalState((nuxtApp = useNuxtApp()) => {
  const { currentRoute } = useRouter();

  const result = computedEager(() =>
    getNavPages(nuxtApp)
      .map((page) => getNavPage(page, nuxtApp))
      .filter((page) => page !== undefined),
  );

  /**
   * 获取页面
   * @param to 页面路由
   * @returns 页面
   */
  function getPage(to: FastNavPageFilled["to"] = currentRoute.value) {
    return result.value.find((page) => toEqual(page.to, to, nuxtApp));
  }

  const usePage = reactify(getPage);

  return extendRef(result, {
    current: usePage(),
    getPage,
    usePage,
  });
});
