import { defineNuxtPlugin, ref, useRouter } from "#imports";
import { isEqual } from "lodash-es";
import { useNavHistories } from "../composables";
import type { FsNavHistory } from "../types";

export default defineNuxtPlugin({
  hooks: {
    "fast-nav:history-equal"(a, b, result) {
      result.value = a && b && isEqual(a.to, b.to);
    },
  },
  async setup(nuxtApp) {
    const router = useRouter();
    const { open } = useNavHistories();

    router.afterEach(async (to) => {
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
      await open(history.value);
    });
  },
});
