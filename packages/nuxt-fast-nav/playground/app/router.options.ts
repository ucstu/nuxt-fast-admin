import type { RouterOptions } from "nuxt/schema";

export default <RouterOptions>{
  routes(_routes) {
    console.log(_routes);

    return _routes.filter((route) => route.path.startsWith("/"));
  },
};
