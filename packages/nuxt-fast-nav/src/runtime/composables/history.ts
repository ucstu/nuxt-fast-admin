import { computed, getRouteMeta, useRouter, useState } from "#imports";
import type { LocationQuery } from "#vue-router";
import {
  createSharedComposable,
  extendRef,
} from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { isEqual } from "lodash-es";
import type { BaseMeta, TabMeta } from "../types";

interface History {
  /**
   * 页面路径
   */
  path: string;
  /**
   * 查询参数
   */
  query?: LocationQuery;
  /**
   * 元数据
   */
  meta?: BaseMeta & {
    /**
     * 标签配置
     */
    tab?: TabMeta;
  };
}

function historyEqual(a: History, b: History) {
  return a.path === b.path && isEqual(a.query, b.query);
}

export const useHistories = createSharedComposable(() => {
  const { currentRoute } = useRouter();

  const histories = useState<Array<History>>("fast-nav:histories", () => []);
  const result = computed(() =>
    histories.value.map((item) => ({
      ...item,
      meta: defu(item.meta ?? {}, getRouteMeta(item.path)) as Exclude<
        History["meta"],
        undefined
      >,
    }))
  );
  const current = computed(() =>
    result.value.find((item) => historyEqual(item, currentRoute.value))
  );

  return extendRef(result, {
    current,
    open(history = current.value) {
      if (!history) return;
      const index = histories.value.findIndex((item) =>
        historyEqual(item, history)
      );
      if (index !== -1) {
        if (!isEqual(histories.value[index].meta, history.meta)) {
          histories.value[index].meta = history.meta;
        }
        return;
      }
      histories.value.push(history);
    },
    close(history = current.value) {
      if (!history) return;
      const index = histories.value.findIndex((item) =>
        historyEqual(item, history)
      );
      if (index === -1) return;
      histories.value.splice(index, 1);
    },
    closeAll() {
      histories.value.splice(0, histories.value.length);
    },
    closeOthers(history = current.value) {
      if (!history) return;
      const index = histories.value.findIndex((item) =>
        historyEqual(item, history)
      );
      if (index === -1) return;
      histories.value.splice(0, index);
      histories.value.splice(1, histories.value.length);
    },
  });
});
