import { defineNuxtPlugin } from "#app";
import { useRouter } from "#imports";
import { assign } from "lodash-es";
import { getPageFilled } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const router = useRouter();
    nuxtApp.hook("fast-route:get-meta", (path, result) => {
      const route = router.getRoutes().find((route) => route.path === path);
      assign(
        result.value,
        getPageFilled({
          to: { path },
          children: route?.children,
        }),
      );
    });
  },
});
