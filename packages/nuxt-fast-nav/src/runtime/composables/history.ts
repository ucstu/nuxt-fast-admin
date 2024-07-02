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
import { historyEqual } from "../utils";

async function findAsync<T>(
  array: Array<T>,
  predicate: (item: T) => Promise<boolean>
) {
  const results = await Promise.all(array.map(predicate));
  return array.find((_, index) => results[index]);
}

async function findSameHistory(
  array: Array<FsNavHistory>,
  history: FsNavHistory,
  nuxtApp = useNuxtApp()
) {
  return await findAsync(
    array,
    async (item) =>
      await new Promise((resolve) => {
        const result = ref(false);
        nuxtApp
          .callHook("fast-nav:history-equal", item, history, result)
          .then(() => resolve(result.value));
      })
  );
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
    result.value.find((item) => historyEqual(item, { to: currentRoute.value }))
  );

  return extendRef(result, {
    current,
    async open(history: FsNavHistory | undefined = current.value) {
      if (!history) return;
      const old = await findSameHistory(histories.value, history, nuxtApp);
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
      const old = await findSameHistory(histories.value, history, nuxtApp);
      if (!old) {
        return console.warn(`[fast-nav] 未找到历史 `, history, ` 的记录`);
      }

      histories.value.splice(histories.value.indexOf(old), 1);
      if (histories.value.length === 0) {
        await navigateTo(config.value.home);
      } else {
        await navigateBack();
      }
    },
    async closeAll() {
      histories.value.splice(0, histories.value.length);
      await navigateTo(config.value.home);
    },
    async closeOthers(history: FsNavHistory | undefined = current.value) {
      if (!history) return;
      const index = histories.value.findIndex((item) =>
        historyEqual(item, history)
      );
      if (index === -1) return;
      histories.value.splice(0, index);
      histories.value.splice(1, histories.value.length);
    },
  });
}
