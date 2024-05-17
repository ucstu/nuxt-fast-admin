import { callWithNuxt } from "#app";
import { useNuxtApp } from "#imports";
import type {
  RouteLocationNormalizedLoaded,
  RouteRecordNormalized,
} from "#vue-router";
import type { FsNavPage, FsNavPageFilled } from "../../module";
import { useAppConfigRef } from "../composables/config";

declare module "#vue-router" {
  interface RouteMeta extends FsNavPage {}
}

function getPageParent(
  route: RouteRecordNormalized | RouteLocationNormalizedLoaded,
) {
  if (typeof route.name !== "string") return "$root";
  return route.name.split("-").slice(0, -1).join(".") || "$root";
}

export function _getPageFilled(
  route: RouteRecordNormalized | RouteLocationNormalizedLoaded,
): FsNavPageFilled {
  const config = useAppConfigRef("fastNav").value!;

  const { name, path, meta } = route;
  const title = meta.title ?? name?.toString() ?? "undefined";
  const icon = meta.icon ?? config.page!.icon!;
  const desc = meta.desc ?? "";

  return {
    ...meta,
    name: name?.toString() ?? "undefined",
    path,
    title,
    icon,
    desc,
    menu: {
      ...meta.menu,
      title: meta.menu?.title ?? title,
      icon: meta.menu?.icon ?? icon,
      desc: meta.menu?.desc ?? desc,
      has: meta.menu?.has ?? config.page!.menu!.has!,
      show: meta.menu?.show ?? config.page!.menu!.show!,
      parent: encodeURI(meta.menu?.parent ?? getPageParent(route)) as Exclude<
        Exclude<FsNavPage["menu"], undefined>["parent"],
        undefined
      >,
      disabled: meta.menu?.disabled ?? config.page!.menu!.disabled!,
      order: meta.menu?.order ?? config.page!.menu!.order!,
    },
    tab: {
      ...meta.tab,
      title: meta.tab?.title ?? title,
      icon: meta.tab?.icon ?? icon,
      desc: meta.tab?.desc ?? desc,
      has: meta.tab?.has ?? config.page!.tab!.has!,
      show: meta.tab?.show ?? config.page!.tab!.show!,
    },
  };
}

export async function getPageFilled(
  route: RouteRecordNormalized | RouteLocationNormalizedLoaded,
): Promise<FsNavPageFilled | undefined> {
  const nuxtApp = useNuxtApp();
  const config = useAppConfigRef("fastNav").value!;
  const pageFilled = _getPageFilled(route);
  return config.hooks!.getPage
    ? await callWithNuxt(nuxtApp, () => config.hooks!.getPage!(pageFilled))
    : pageFilled;
}
