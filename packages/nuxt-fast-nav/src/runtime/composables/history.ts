import {
  computed,
  getRouteMeta,
  navigateTo,
  override,
  ref,
  toRef,
  useAppConfig,
  useNuxtApp,
  useRouter,
  useState,
} from "#imports";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { isEqual } from "lodash-es";
import type { FsNavHistory, FsNavPageFilled } from "../types";

function historyEqual(
  a: FsNavHistory,
  b: FsNavHistory,
  nuxtApp = useNuxtApp()
): boolean {
  const result = ref(false);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => {
      hooks.forEach((hook) => hook(...args));
    },
    "fast-nav:history-equal",
    a,
    b,
    result
  );
  return result.value;
}

export function useNavHistories(nuxtApp = useNuxtApp()) {
  const config = toRef(useAppConfig(), "fastNav");
  const { currentRoute } = useRouter();

  const histories = useState<Array<FsNavHistory>>(
    "fast-nav:histories",
    () => []
  );
  const result = computed(() =>
    histories.value.map((item) => ({
      ...item,
      meta: defu(item.meta ?? {}, getRouteMeta<FsNavPageFilled>(item.to)),
    }))
  );
  const current = computed(() =>
    result.value.find((item) =>
      historyEqual(item, { to: currentRoute.value }, nuxtApp)
    )
  );

  return extendRef(result, {
    current,
    async open(history: FsNavHistory | undefined = current.value) {
      if (!history) return;
      const old = histories.value.find((item) =>
        historyEqual(item, history, nuxtApp)
      );
      if (old) {
        if (!isEqual(old, history)) {
          override(old, history);
        }
        return;
      }
      histories.value.push(history);
    },
    async close(history: FsNavHistory | undefined = current.value) {
      if (!history) return;
      const old = histories.value.find((item) => historyEqual(item, history));
      if (!old) {
        return console.warn(`[fast-nav] 未找到历史 `, history, ` 的记录`);
      }

      const index = histories.value.indexOf(old);
      histories.value.splice(index, 1);
      await navigateTo(
        (histories.value[index] ?? histories.value[index - 1])?.to ??
          config.value.home
      );
    },
    async closeAll() {
      histories.value.splice(0, histories.value.length);
      await navigateTo(config.value.home);
    },
    async closeOthers(history: FsNavHistory | undefined = current.value) {
      if (!history) return;
      const old = histories.value.find((item) => historyEqual(item, history));
      if (!old) {
        return console.warn(`[fast-nav] 未找到历史 `, history, ` 的记录`);
      }

      const index = histories.value.indexOf(old);
      histories.value.splice(0, index);
      histories.value.splice(1, histories.value.length - 1);
    },
  });
}
