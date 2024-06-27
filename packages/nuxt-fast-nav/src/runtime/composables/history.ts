import {
  getFuConfig,
  navigateTo,
  toValue,
  useRouter,
  useState,
  type MaybeRefOrGetter,
} from "#imports";
import { type RouteLocationNormalized } from "#vue-router";
import type { FsNavPageFilled } from "../types";
import { isFsNavPageEqual } from "../utils";

export function useHistories() {
  return useState<Array<string>>("fast-nav:histories", () => []);
}

export function useCurrentPage() {
  return useRouter().currentRoute.value.meta as FsNavPageFilled;
}

export async function openPage(
  route: MaybeRefOrGetter<RouteLocationNormalized>
) {
  const page = toValue(route).meta as FsNavPageFilled;
  const histories = useHistories();
  if (
    !page ||
    histories.value.some((history) => isFsNavPageEqual(page, history))
  )
    return;
  histories.value.push(page);
}

export async function closePage(page?: FsNavPageFilled) {
  const histories = useHistories();
  const current = useCurrentPage();
  const config = getFuConfig("fastNav");

  page ??= current;

  const index = histories.value.findIndex((history) =>
    isFsNavPageEqual(page, history)
  );
  // 如果没有找到页面，则不关闭
  if (!page || index === -1) return;
  // 如果关闭的不是当前页面，则直接关闭
  if (!isFsNavPageEqual(page, current)) {
    histories.value.splice(index, 1);
    return;
  }
  // 如果是最后一个页面并且是首页，则不关闭
  if (histories.value.length === 1 && page.path === config.home) return;
  // 关闭当前页面
  histories.value.splice(index, 1);
  // 导航到旁边页面或者首页
  await navigateTo(
    histories.value[index] ?? histories.value[index - 1] ?? config.home
  );
}

export async function closeAllPages() {
  const histories = useHistories();
  const config = getFuConfig("fastNav");
  histories.value = [];
  await navigateTo(config.home);
}

export async function closeOtherPages(page?: FsNavPageFilled) {
  const histories = useHistories();
  const current = useCurrentPage();
  histories.value = histories.value.filter(
    (history) => !isFsNavPageEqual(page ?? current, history)
  );
}
