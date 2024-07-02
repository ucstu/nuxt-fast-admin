import { defineNuxtPlugin, ref, useRouter } from "#imports";
import { cloneDeep } from "lodash-es";
import { useRouteMetas } from "../composables";

export default defineNuxtPlugin({
  async setup(nuxtApp) {
    const router = useRouter();
    const routeMetas = useRouteMetas();

    await nuxtApp.callHook("fast-route:brfore");

    for (const route of router.getRoutes()) {
      if (!routeMetas.value[route.path]) {
        const result = ref(cloneDeep(route.meta));
        await nuxtApp.callHook("fast-route:get-meta", route, result);
        routeMetas.value[route.path] = result.value;
        continue;
      }
      route.meta = routeMetas.value[route.path];
    }

    await nuxtApp.callHook("fast-route:after");
  },
});
