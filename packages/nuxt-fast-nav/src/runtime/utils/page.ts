import { useAppConfig } from "#imports";
import type { RouteRecordNormalized } from "#vue-router";
import { configKey } from "../config";
import type {
  FastNavPage,
  FastNavPageFilled,
  ModuleConfigDefaults,
} from "../types";

function getPageParent(route: RouteRecordNormalized) {
  return (
    route.path.replace("/", "").split("/").slice(0, -1).join(".") || "$root"
  );
}

export function getNavPageFilled(
  page: FastNavPage,
  route: RouteRecordNormalized,
): FastNavPageFilled {
  const config = useAppConfig()[configKey] as ModuleConfigDefaults;

  const { name, path, children } = route;
  const type = page.type ?? "static";
  const title = page.title ?? name?.toString() ?? path;
  const icon = page.icon ?? config.page.icon;
  const desc = page.desc ?? "";

  return {
    type,
    title,
    icon,
    desc,
    menu: {
      ...page.menu,
      title: page.menu?.title ?? title,
      icon: page.menu?.icon ?? icon,
      desc: page.menu?.desc ?? desc,
      has: page.menu?.has ?? config.page.menu.has,
      show:
        (page.menu?.show ??
        ((children?.length ?? 0) === 0 && !/\/:.*?\(\)/.test(path)))
          ? config.page.menu.show
          : false,
      parent: encodeURI(page.menu?.parent ?? getPageParent(route)),
      disabled: page.menu?.disabled ?? config.page.menu.disabled,
      order: page.menu?.order ?? config.page.menu.order,
    },
    tab: {
      ...page.tab,
      title: page.tab?.title ?? title,
      icon: page.tab?.icon ?? icon,
      desc: page.tab?.desc ?? desc,
      has: page.tab?.has ?? config.page.tab.has,
      show: page.tab?.show ?? config.page.tab.show,
    },
    to: {
      path: route.path,
    },
  };
}
