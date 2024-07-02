import { defineNuxtPlugin, ref, useRouter } from "#imports";
import { useNavHistories } from "../composables";
import type { FsNavHistory } from "../types";

export default defineNuxtPlugin({
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
      open(history.value);
    });
  },
});
