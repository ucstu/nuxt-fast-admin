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
          fullPath: to.fullPath,
          params: to.params,
          path: to.path,
          query: to.query,
          hash: to.hash,
          name: to.name,
        },
      });
      await nuxtApp.callHook(
        "fast-nav:get-history",
        to,
        extendRef(history, {
          remove() {
            history.value = undefined;
          },
          merge(
            value: Partial<FastNavHistory>,
            order: "before" | "after" = "before",
          ) {
            history.value = (
              order === "before"
                ? defu(value, history.value)
                : defu(history.value, value)
            ) as FastNavHistory;
          },
        }),
      );
      if (history.value) histories.open(history.value);
    });
  },
});
