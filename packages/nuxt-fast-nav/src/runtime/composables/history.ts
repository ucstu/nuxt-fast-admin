import {
  navigateTo,
  toValue,
  useState,
  type MaybeRefOrGetter,
  type Ref,
} from "#imports";
import { type RouteLocationNormalized } from "#vue-router";
import type { ReadonlyDeep } from "type-fest";
import type { FsNavPageFilled } from "../types";
import { pageEqual } from "../utils";
import { useAppConfigRef } from "./config";
import { usePage } from "./page";

export const useHistories = (): Ref<Array<FsNavPageFilled>> =>
  useState<Array<FsNavPageFilled>>("fast-nav-histories", () => []);

export async function openPage(
  route: MaybeRefOrGetter<RouteLocationNormalized>,
) {
  const page = usePage(route).value;
  const histories = useHistories();
  if (!page || histories.value.some((history) => pageEqual(page, history)))
    return;
  histories.value.push(page);
}

export async function closePage(
  page?: MaybeRefOrGetter<
    ReadonlyDeep<FsNavPageFilled> | FsNavPageFilled | undefined
  >,
) {
  const config = useAppConfigRef("fastNav").value!;
  const currentPage = usePage().value;
  const histories = useHistories();
  const _page = toValue(page) || currentPage;
  const index = histories.value.findIndex((history) =>
    pageEqual(_page, history),
  );
  // 如果没有找到页面，则不关闭
  if (!_page || index === -1) return;
  // 如果关闭的不是当前页面，则直接关闭
  if (!pageEqual(_page, currentPage)) {
    histories.value.splice(index, 1);
    return;
  }
  // 如果是最后一个页面并且是首页，则不关闭
  if (histories.value.length === 1 && _page.path === config.home) return;
  // 关闭当前页面
  histories.value.splice(index, 1);
  // 导航到旁边页面或者首页
  await navigateTo(
    histories.value[index] ?? histories.value[index - 1] ?? config.home,
  );
}

export async function closeAllPages() {
  const config = useAppConfigRef("fastNav").value!;
  const histories = useHistories();
  histories.value = [];
  await navigateTo(config.home);
}

export async function closeOtherPages(
  page?: MaybeRefOrGetter<
    ReadonlyDeep<FsNavPageFilled> | FsNavPageFilled | undefined
  >,
) {
  const histories = useHistories();
  const currentPage = usePage().value;
  const config = useAppConfigRef("fastNav").value!;
  const _page = toValue(page);
  histories.value = histories.value.filter((history) =>
    pageEqual(_page ?? currentPage, history),
  );
  if (_page && !pageEqual(_page, currentPage)) {
    await navigateTo(_page);
    return;
  }
  if (!currentPage) {
    await navigateTo(config.home);
  }
}
