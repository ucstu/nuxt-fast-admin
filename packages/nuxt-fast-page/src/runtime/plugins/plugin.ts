import { defineNuxtPlugin, useRouter } from "#imports";
import { createPages } from "../composables";

export default defineNuxtPlugin({
  dependsOn: ["@ucstu/nuxt-fast-utils"],
  setup() {
    const router = useRouter();
    const routeMetas = createPages();

    for (const route of router.getRoutes()) {
      if (!routeMetas.origin[route.path]) {
        routeMetas.origin[route.path] = route.meta;
        continue;
      }
      route.meta = routeMetas.origin[route.path];
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
