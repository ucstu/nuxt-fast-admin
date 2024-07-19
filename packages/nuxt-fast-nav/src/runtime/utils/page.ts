import type { NuxtApp } from "#app";
import { getModuleConfig, resolveTo, useNuxtApp } from "#imports";
import type { RouteLocationAsRelativeGeneric } from "#vue-router";
import { configKey } from "../config";
import type { FastNavPage, FastNavPageFilled } from "../types";

function isParam(str: string) {
  return /^:.*/.test(str);
}

function getPageParent(path: string) {
  return (
    path
      .split("/")
      .filter((item) => item && !isParam(item))
      .slice(0, -1)
      .join(".") || "$root"
  );
}

export function getNavPageFilled(
  page: FastNavPage,
  nuxtApp: NuxtApp = useNuxtApp(),
): FastNavPageFilled {
  const navConfig = getModuleConfig(configKey, nuxtApp);

  const to = resolveTo(page.to, nuxtApp);

  const path = to.path!;
  const name = (to as RouteLocationAsRelativeGeneric).name;

  const type = page.type ?? "static";
  const title = page.title ?? name?.toString() ?? path;
  const icon = page.icon ?? navConfig.page.icon;
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
      has: page.menu?.has ?? navConfig.page.menu.has,
      show: page.menu?.show ?? navConfig.page.menu.show,
      parent: encodeURI(page.menu?.parent ?? getPageParent(path)),
      disabled: page.menu?.disabled ?? navConfig.page.menu.disabled,
      order: page.menu?.order ?? navConfig.page.menu.order,
    },
    tab: {
      ...page.tab,
      title: page.tab?.title ?? title,
      icon: page.tab?.icon ?? icon,
      desc: page.tab?.desc ?? desc,
      has: page.tab?.has ?? navConfig.page.tab.has,
      show: page.tab?.show ?? navConfig.page.tab.show,
    },
    to: {
      path,
    },
  };
}
