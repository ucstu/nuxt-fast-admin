import {
  defineNuxtPlugin,
  refAppConfig,
  useRouteMetas,
  useRouter,
} from "#imports";
import { watchDeep } from "@ucstu/nuxt-fast-utils/exports";
import { useHistories } from "../composables";
import type { FsNavHistory } from "../types";

export default defineNuxtPlugin({
  async setup(nuxtApp) {
    const router = useRouter();
    const { open } = useHistories();
    const { refresh } = useRouteMetas();
    const config = refAppConfig("fastNav");

    router.afterEach(async (to) => {
      const history: FsNavHistory = {
        path: to.path,
        query: to.query,
      };
      await nuxtApp.callHook("fast-nav:get-history", to, history);
      open(history);
    });

    watchDeep(
      () => config.value.page,
      () => refresh()
    );
  },
});
