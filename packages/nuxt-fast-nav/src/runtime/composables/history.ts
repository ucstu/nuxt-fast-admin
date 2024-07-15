import type { NuxtApp } from "#app";
import {
  computed,
  createNuxtGlobalState,
  navigateTo,
  toValue,
  useAppConfig,
  useNuxtApp,
  useRouter,
  useState,
  type MaybeRefOrGetter,
} from "#imports";
import { extendRef, reactify } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { assign, cloneDeep, isEqual } from "lodash-es";
import { configKey } from "../config";
import type {
  FastNavHistory,
  FastNavHistoryFilled,
  FastNavPageFilled,
  ModuleConfigDefaults,
} from "../types";
import { toEqual } from "../utils";
import { useNavPages } from "./page";

function compressHistory(history: FastNavHistory): FastNavHistory {
  const clone = cloneDeep(history);

  if (!clone.meta || Object.keys(clone.meta).length === 0) delete clone.meta;
  if (typeof clone.to === "string") return clone;

  if (!clone.to.force) delete clone.to.force;
  if (!clone.to.hash) delete clone.to.hash;

  if ("name" in clone.to) {
    if (!clone.to.name) delete clone.to.name;
    if (!clone.to.params || Object.keys(clone.to.params).length === 0)
      delete clone.to.params;
  }

  if (!clone.to.query || Object.keys(clone.to.query).length === 0)
    delete clone.to.query;
  if (!clone.to.replace) delete clone.to.replace;
  if (!clone.to.state || Object.keys(clone.to.state).length === 0)
    delete clone.to.state;

  return clone;
}

export const useNavHistories = createNuxtGlobalState(function (
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  const pages = useNavPages(nuxtApp);
  const { currentRoute } = useRouter();
  const appConfig = useAppConfig();
  const config = computed(() => appConfig[configKey] as ModuleConfigDefaults);

  const origin = useState<Array<FastNavHistory>>(
    "fast-nav:histories",
    () => [],
  );

  const result = computed(
    () =>
      origin.value.map((item) => ({
        ...item,
        meta: defu(item.meta ?? {}, pages.getPage(item.to)),
      })) as Array<FastNavHistoryFilled>,
  );

  /**
   * 获取历史
   * @param to 路由信息
   * @returns 获取页面
   */
  function getHistory(to: FastNavPageFilled["to"] = currentRoute.value) {
    return result.value.find((page) => toEqual(page.to, to, nuxtApp));
  }

  const useHistory = reactify(getHistory);

  const current = useHistory();

  /**
   * 打开历史
   * @param history 历史
   */
  function open(history: MaybeRefOrGetter<FastNavHistory>) {
    const _history = compressHistory(toValue(history));

    const old = origin.value.find((item) =>
      toEqual(item.to, _history.to, nuxtApp),
    );
    if (old) {
      if (!isEqual(old, _history)) assign(old, _history);
      return;
    }

    origin.value.push(_history);
  }

  /**
   * 关闭历史
   * @param history 历史
   */
  async function close(
    history: MaybeRefOrGetter<FastNavHistory> | undefined = current.value,
  ) {
    const _history = toValue(history);

    if (!_history) return;
    const old = origin.value.find((item) =>
      toEqual(item.to, _history.to, nuxtApp),
    );
    if (!old) {
      return console.warn(`[fast-nav] 未找到历史 `, _history, ` 的记录`);
    }

    const index = origin.value.indexOf(old);

    // 如果 "希望关闭的页面" 不是 "当前页面" 则删除 "希望关闭的页面" 并直接返回
    if (!toEqual(old.to, current.value?.to, nuxtApp)) {
      origin.value.splice(index, 1);
      return;
    }

    const newTo =
      (origin.value[index + 1] ?? origin.value[index - 1])?.to ??
      config.value.home;
    // 如果 "预计开启的页面" 不是 "当前页面" 则删除 "希望关闭的页面" 并跳转到 "预计开启的页面"
    if (!toEqual(old.to, newTo, nuxtApp)) {
      origin.value.splice(index, 1);
      await navigateTo(newTo);
    }
  }

  /**
   * 关闭所有历史
   */
  async function closeAll() {
    // 筛除 "首页" 以外的所有历史
    origin.value = origin.value.filter((item) =>
      toEqual(item.to, config.value.home, nuxtApp),
    );
    // 如果 "剩余历史" 为空则跳转到 "首页"
    if (origin.value.length === 0) {
      await navigateTo(config.value.home);
    }
  }

  /**
   * 关闭其他历史
   * @param history 历史
   */
  async function closeOthers(
    history: MaybeRefOrGetter<FastNavHistory> | undefined = current.value,
  ) {
    const _history = toValue(history);

    if (!_history) return;
    const old = origin.value.find((item) =>
      toEqual(item.to, _history.to, nuxtApp),
    );
    if (!old) {
      return console.warn(`[fast-nav] 未找到历史 `, _history, ` 的记录`);
    }

    // 移除当前历史以外的所有历史
    const index = origin.value.indexOf(old);
    origin.value.splice(0, index);
    origin.value.splice(1, origin.value.length - 1);

    // 如果保留的页面是当前页面就直接返回
    if (toEqual(old.to, current.value?.to, nuxtApp)) return;
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
