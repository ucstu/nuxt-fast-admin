import { addRouteMiddleware, defineNuxtPlugin, shallowRef } from "#imports";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { useNavHistories } from "../composables";
import type { FastNavHistory } from "../types";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const histories = useNavHistories();

    addRouteMiddleware(async (to) => {
      const history = shallowRef<FastNavHistory | undefined>({
        to: {
          path: to.path,
          query: to.query,
          hash: to.hash,
        },
      });
      await nuxtApp.callHook(
        "fast-nav:get-history",
        to,
        extendRef(history, {
          remove() {
            history.value = undefined;
          },
          merge(value: Partial<FastNavHistory>) {
            history.value = defu(value, history.value) as FastNavHistory;
          },
        })
      );
      if (history.value) histories.open(history.value);
    });
  },
});
