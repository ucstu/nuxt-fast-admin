import {
  computedEager,
  getRouteMeta,
  navigateTo,
  ref,
  toRef,
  useAppConfig,
  useNuxtAppBack,
  useRouter,
  useState,
  type Ref,
} from "#imports";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { assign, isEqual } from "lodash-es";
import type {
  FsNavConfigDefaults,
  FsNavHistory,
  FsNavPageFilled,
} from "../types";

function historyEqual(
  a: FsNavHistory,
  b: FsNavHistory,
  nuxtApp = useNuxtAppBack()
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

export function createNavHistories() {
  const config = toRef(useAppConfig(), "fastNav") as Ref<FsNavConfigDefaults>;
  const { currentRoute } = useRouter();

  const origin = useState<Array<FsNavHistory>>("fast-nav:histories", () => []);

  const result = computedEager(() =>
    origin.value.map((item) => ({
      ...item,
      meta: defu(item.meta ?? {}, getRouteMeta<FsNavPageFilled>(item.to)),
    }))
  );
  const current = computedEager(() =>
    result.value.find((item) => historyEqual(item, { to: currentRoute.value }))
  );

  return extendRef(result, {
    origin: extendRef(origin, {
      current: computedEager(() =>
        origin.value.find((item) =>
          historyEqual(item, { to: currentRoute.value })
        )
      ),
    }),
    current,
    open(history: FsNavHistory | undefined = current.value) {
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
    async close(history: FsNavHistory | undefined = current.value) {
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
    async closeOthers(history: FsNavHistory | undefined = current.value) {
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
}

export function useNavHistories(nuxtApp = useNuxtAppBack()) {
  return nuxtApp.$fastNav.histories as ReturnType<typeof createNavHistories>;
}
