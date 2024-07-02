import { useAppConfig } from "#imports";
import type { RouteMeta, RouteRecordRaw } from "#vue-router";
import type { FsNavExtra, FsNavPageFilled } from "../types";

function getPageParent(options: Optinos) {
  return (
    options.to.path.replace("/", "").split("/").slice(0, -1).join(".") ||
    "$root"
  );
}

interface Optinos extends RouteMeta, Required<FsNavExtra> {
  children?: Array<RouteRecordRaw>;
}
export function getPageFilled(options: Optinos): FsNavPageFilled {
  const config = useAppConfig().fastNav;

  const { to, children } = options;
  const title = options.title ?? to.path;
  const icon = options.icon ?? config.page!.icon!;
  const desc = options.desc ?? "";

  return {
    title,
    icon,
    desc,
    menu: {
      ...options.menu,
      title: options.menu?.title ?? title,
      icon: options.menu?.icon ?? icon,
      desc: options.menu?.desc ?? desc,
      has: options.menu?.has ?? config.page!.menu!.has!,
      show:
        options.menu?.show ??
        ((children?.length ?? 0) === 0 && !/\/:.*?\(\)/.test(to.path))
          ? config.page!.menu!.show!
          : false,
      parent: encodeURI(options.menu?.parent ?? getPageParent(options)),
      disabled: options.menu?.disabled ?? config.page!.menu!.disabled!,
      order: options.menu?.order ?? config.page!.menu!.order!,
    },
    tab: {
      ...options.tab,
      title: options.tab?.title ?? title,
      icon: options.tab?.icon ?? icon,
      desc: options.tab?.desc ?? desc,
      has: options.tab?.has ?? config.page!.tab!.has!,
      show: options.tab?.show ?? config.page!.tab!.show!,
    },
    to,
  };
}
