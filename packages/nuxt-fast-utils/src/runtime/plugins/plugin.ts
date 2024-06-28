import { defineNuxtPlugin, useNuxtApp, useRouter } from "#imports";
import { cloneDeep } from "lodash-es";
import { useOriginalRouteMetas, useRouteMetas } from "../composables";

export default defineNuxtPlugin({
  async setup() {
    const router = useRouter();
    const nuxtApp = useNuxtApp();
    const routeMetas = useRouteMetas();
    const originalRouteMetas = useOriginalRouteMetas();

    for (const route of router.getRoutes()) {
      originalRouteMetas.set(route.path, route.meta);
      if (!routeMetas.has(route.path)) {
        routeMetas.set(route.path, cloneDeep(route.meta));
        await nuxtApp.callHook(
          "fast-utils:get-route-meta",
          route,
          routeMetas.get(route.path)!
        );
      }
      route.meta = routeMetas.get(route.path)!;
    }
  },
});
