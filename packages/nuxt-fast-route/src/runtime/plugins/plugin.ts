import { defineNuxtPlugin, useRouter } from "#imports";
import { cloneDeep } from "lodash-es";
import { createRouteMetas } from "../composables";

export default defineNuxtPlugin({
  dependsOn: ["@ucstu/nuxt-fast-utils"],
  setup() {
    const router = useRouter();
    const routeMetas = createRouteMetas();
    const { origin } = routeMetas;

    for (const route of router.getRoutes()) {
      if (!origin[route.path]) {
        origin[route.path] = cloneDeep(route.meta);
        continue;
      }
      route.meta = origin[route.path];
    }

    return {
      provide: {
        fastRoute: {
          routeMetas,
        },
      },
    };
  },
});
