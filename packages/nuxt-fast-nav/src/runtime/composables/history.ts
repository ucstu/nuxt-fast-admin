import {
  computed,
  createNuxtGlobalState,
  navigateTo,
  toValue,
  useNuxtConfig,
  useRouter,
  useState,
  type MaybeRefOrGetter,
} from "#imports";
import { extendRef, reactify } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { assign, isEqual } from "lodash-es";
import { configKey } from "../../config";
import type { FastNavHistory, FastNavPageFilled } from "../types";
import { toEqual } from "../utils/basic";
import { useNavPages } from "./page";

export const useNavHistories = createNuxtGlobalState(() => {
  const pages = useNavPages();
  const { currentRoute } = useRouter();
  const config = useNuxtConfig(configKey);

  const origin = useState<Array<FastNavHistory>>(
    "fast-nav:histories",
    () => []
  );
  const result = computed(() =>
    origin.value.map((item) => ({
      ...item,
      meta: defu(item.meta ?? {}, pages.getPage(item.to)),
    }))
  );

  /**
   * 获取历史
   * @param to 路由信息
   * @returns 获取页面
   */
  function getHistory(to: FastNavPageFilled["to"] = currentRoute.value) {
    return result.value.find((page) => toEqual(page.to, to));
  }

  const useHistory = reactify(getHistory);

  const current = useHistory();

  /**
   * 打开历史
   * @param history 历史
   */
  function open(history: MaybeRefOrGetter<FastNavHistory>) {
    const _history = toValue(history);

    const old = origin.value.find((item) => toEqual(item.to, _history.to));
    if (old) {
      if (!isEqual(old, history)) assign(old, history);
      return;
    }

    origin.value.push(_history);
  }

  /**
   * 关闭历史
   * @param history 历史
   */
  async function close(
    history: MaybeRefOrGetter<FastNavHistory> | undefined = current.value
  ) {
    const _history = toValue(history);

    if (!_history) return;
    const old = origin.value.find((item) => toEqual(item.to, _history.to));
    if (!old) {
      return console.warn(`[fast-nav] 未找到历史 `, _history, ` 的记录`);
    }

    // 从历史记录列表中移除历史
    const index = origin.value.indexOf(old);
    origin.value.splice(index, 1);

    // 如果不是当前页面直接返回
    if (!toEqual(old.to, current.value?.to)) return;
    // 否则是当期页面跳转其他页面
    await navigateTo(
      (origin.value[index] ?? origin.value[index - 1])?.to ?? config.value.home
    );
  }

  /**
   * 关闭所有历史
   */
  async function closeAll() {
    origin.value.splice(0, origin.value.length);
    await navigateTo(config.value.home);
  }

  /**
   * 关闭其他历史
   * @param history 历史
   */
  async function closeOthers(
    history: MaybeRefOrGetter<FastNavHistory> | undefined = current.value
  ) {
    const _history = toValue(history);

    if (!_history) return;
    const old = origin.value.find((item) => toEqual(item.to, _history.to));
    if (!old) {
      return console.warn(`[fast-nav] 未找到历史 `, _history, ` 的记录`);
    }

    // 移除当前历史以外的所有历史
    const index = origin.value.indexOf(old);
    origin.value.splice(0, index);
    origin.value.splice(1, origin.value.length - 1);

    // 如果保留的页面是当前页面就直接返回
    if (toEqual(old.to, current.value?.to)) return;
    // 否则不是当前页面则进行跳转
    await navigateTo(_history.to);
  }

  return extendRef(result, {
    current,
    open,
    close,
    closeAll,
    closeOthers,
  });
});
