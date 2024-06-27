import { defineNuxtPlugin, useRouter, useState } from "#imports";
import type { RouteMeta } from "#vue-router";

interface RouteCache {
  [path: string]: RouteMeta;
}

export default defineNuxtPlugin({
  async setup(nuxtApp) {
    const router = useRouter();
    const metas = useState<RouteCache>("fast-utils:routes", () => ({}));
    for (const route of router.getRoutes()) {
      if (metas.value[route.path]) {
        Object.assign(route.meta, metas.value[route.path]);
        continue;
      }
      await nuxtApp.callHook("fast-utils:route", route, route.meta);
      metas.value[route.path] = route.meta;
    }
  },
});
