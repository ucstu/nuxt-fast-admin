import { callWithNuxt } from "#app";
import { defineNuxtPlugin, useRouter } from "#imports";
import { openPage } from "../composables/history";
import { refreshMenus } from "../composables/menu";

export default defineNuxtPlugin({
  async setup(nuxtApp) {
    const router = useRouter();
    router.afterEach((to) => callWithNuxt(nuxtApp, () => openPage(to)));
    await refreshMenus();
  },
});
