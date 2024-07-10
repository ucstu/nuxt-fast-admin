import { getNuxtConfig } from "#imports";
import type { RouteRecordRaw } from "#vue-router";
import { configKey } from "../../config";
import type { FastNavExtra, FastNavPage, FastNavPageFilled } from "../types";

interface Options extends FastNavExtra {
  children?: Array<RouteRecordRaw>;
}

function getPageParent(options: Options) {
  return (
    options.to.path.replace("/", "").split("/").slice(0, -1).join(".") ||
    "$root"
  );
}

export function getPageFilled(
  page: FastNavPage,
  options: Options
): FastNavPageFilled {
  const config = getNuxtConfig(configKey);

  const { to, children } = options;
  const type = page.type ?? "static";
  const title = page.title ?? to.path;
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
        page.menu?.show ??
        ((children?.length ?? 0) === 0 && !/\/:.*?\(\)/.test(to.path))
          ? config.page.menu.show
          : false,
      parent: encodeURI(page.menu?.parent ?? getPageParent(options)),
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
    to,
  };
}
