import {
  computed,
  createNuxtGlobalState,
  getRouteMeta,
  navigateTo,
  useNuxtConfig,
  useRouter,
  useState,
} from "#imports";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { assign, isEqual } from "lodash-es";
import { configKey } from "../../config";
import type { FastNavHistory, FastNavPageFilled } from "../types";
import { toEqual } from "../utils/basic";

export const useNavHistories = createNuxtGlobalState(() => {
  const config = useNuxtConfig(configKey);
  const { currentRoute } = useRouter();

  const origin = useState<Array<FastNavHistory>>(
    "fast-nav:histories",
    () => []
  );
  const result = computed(() =>
    origin.value.map((item) => ({
      ...item,
      meta: defu(item.meta ?? {}, getRouteMeta<FastNavPageFilled>(item.to)),
    }))
  );
  const current = computed(() =>
    result.value.find((item) => toEqual(item.to, currentRoute.value))
  );

  return extendRef(result, {
    current,
    open(history: FastNavHistory | undefined = current.value) {
      if (!history) return;
      const old = origin.value.find((item) => historyEqual(item, history));
      if (old) {
        if (!isEqual(old, history)) {
          assign(old, history);
        }
        return;
      }
      origin.value.push(history);
    },
    async close(history: FastNavHistory | undefined = current.value) {
      if (!history) return;
      const old = origin.value.find((item) => historyEqual(item, history));
      if (!old) {
        return console.warn(`[fast-nav] 未找到历史 `, history, ` 的记录`);
      }

      const isCurrent = current.value && historyEqual(old, current.value);

      const index = origin.value.indexOf(old);
      origin.value.splice(index, 1);

      if (!isCurrent) return;
      await navigateTo(
        (origin.value[index] ?? origin.value[index - 1])?.to ??
          config.value.home
      );
    },
    async closeAll() {
      origin.value.splice(0, origin.value.length);
      await navigateTo(config.value.home);
    },
    async closeOthers(history: FastNavHistory | undefined = current.value) {
      if (!history) return;
      const old = origin.value.find((item) => historyEqual(item, history));
      if (!old) {
        return console.warn(`[fast-nav] 未找到历史 `, history, ` 的记录`);
      }

      const index = origin.value.indexOf(old);
      origin.value.splice(0, index);
      origin.value.splice(1, origin.value.length - 1);
      await navigateTo(history.to);
    },
  });
});
