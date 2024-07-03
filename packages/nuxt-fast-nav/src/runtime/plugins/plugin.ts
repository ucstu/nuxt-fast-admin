import {
  defineNuxtPlugin,
  ref,
  toRef,
  useAppConfig,
  useRouter,
  type Ref,
} from "#imports";
import { isEqual, pick } from "lodash-es";
import { useNavHistories } from "../composables";
import type { FsNavConfigDefaults, FsNavHistory } from "../types";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    const router = useRouter();
    const { open } = useNavHistories();
    const config = toRef(useAppConfig(), "fastNav") as Ref<FsNavConfigDefaults>;

    nuxtApp.hook("fast-nav:history-equal", (a, b, result) => {
      const keys = config.value.keys;
      result.value =
        a && b && isEqual(pick(a.to, ...keys), pick(b.to, ...keys));
    });

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
