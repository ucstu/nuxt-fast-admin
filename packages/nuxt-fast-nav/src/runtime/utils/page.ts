import { getAppConfig } from "#imports";
import type { RouteMeta, RouteRecordNormalized } from "#vue-router";
import type { FsNavPage, FsNavPageFilled } from "../types";

function getRouteParent(route: RouteRecordNormalized) {
  if (typeof route.name !== "string") return "$root";
  return route.name.split("-").slice(0, -1).join(".") || "$root";
}

export function getRouteMetas(
  route: RouteRecordNormalized,
  meta: RouteMeta
): FsNavPageFilled {
  const config = getAppConfig("fastNav");

  const { name, path, children } = route;
  const title = meta.title ?? name?.toString() ?? "undefined";
  const icon = meta.icon ?? config.page!.icon!;
  const desc = meta.desc ?? "";

  return {
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
      show:
        meta.menu?.show ?? children.length > 0
          ? config.page!.menu!.show!
          : false,
      parent: encodeURI(meta.menu?.parent ?? getRouteParent(route)) as Exclude<
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
