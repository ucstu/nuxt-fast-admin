import { addRouteMiddleware, defineNuxtPlugin, ref } from "#imports";
import { useNavHistories } from "../composables";
import type { FastNavHistory } from "../types";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const histories = useNavHistories();

    addRouteMiddleware(async (to) => {
      const history = ref<FastNavHistory>({
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
  },
});
