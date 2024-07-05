import {
  addRouteMiddleware,
  defineNuxtPlugin,
  ref,
  toRef,
  useAppConfig,
  type Ref,
} from "#imports";
import { isEqual, pick } from "lodash-es";
import { createNavHistories, createNavMenus } from "../composables";
import type { FsNavConfigDefaults, FsNavHistory } from "../types";

export default defineNuxtPlugin({
  dependsOn: ["@ucstu/nuxt-fast-utils", "@ucstu/nuxt-fast-route"],
  setup(nuxtApp) {
    const menus = createNavMenus();
    const histories = createNavHistories();
    const config = toRef(useAppConfig(), "fastNav") as Ref<FsNavConfigDefaults>;

    nuxtApp.hook("fast-nav:history-equal", (a, b, result) => {
      const keys = config.value.keys;
      result.value =
        a && b && isEqual(pick(a.to, ...keys), pick(b.to, ...keys));
    });

    addRouteMiddleware(async (to) => {
      const history = ref<FsNavHistory>({
        to: {
          hash: to.hash,
          name: to.name,
          params: to.params,
          path: to.path,
          query: to.query,
        },
      });
      await nuxtApp.callHook("fast-nav:get-history", to, history);
      histories.open(history.value);
    });

    return {
      provide: {
        fastNav: {
          menus,
          histories,
        },
      },
    };
  },
});
