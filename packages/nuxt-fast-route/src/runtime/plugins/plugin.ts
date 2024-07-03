import { defineNuxtPlugin, useRouter } from "#imports";
import { cloneDeep } from "lodash-es";
import { useRouteMetas } from "../composables";

export default defineNuxtPlugin({
  setup() {
    const router = useRouter();
    const { origin } = useRouteMetas();

    for (const route of router.getRoutes()) {
      if (!origin[route.path]) {
        origin[route.path] = cloneDeep(route.meta);
        continue;
      }
      route.meta = origin[route.path];
    }
  },
});
