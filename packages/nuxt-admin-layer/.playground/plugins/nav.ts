export default defineNuxtPlugin({
  enforce: "pre",
  async setup(nuxtApp) {
    const { data: pages } = await usePages();
    const adminConfig = useModuleConfig("fastAdmin");

    adminConfig.value.pages.auth.form.username = undefined;

    nuxtApp.hook("fast-nav:get-history", (to, result) => {
      if (getToPath(to)?.startsWith("/auth")) {
        result.remove();
      }
    });
    nuxtApp.hook("fast-nav:get-pages", (result) => {
      for (const page of pages.value?.content ?? []) {
        if (result.value.some((p) => getToPath(p.to) === page.path)) {
          continue;
        }
        result.value.push({
          to: page.path,
          type: page.type,
          icon: page.icon,
          title: page.name,
          menu: {
            parent: page.menu?.code,
            order: page.sort,
          },
        });
      }
    });
    nuxtApp.hook("fast-nav:get-page", (page, result) => {
      const remote = pages.value?.content?.find(
        (p) => p.path === getToPath(page.to),
      );
      result.merge({
        title: remote?.name,
        icon: remote?.icon,
        menu: {
          parent: remote?.menu?.name ?? "$root",
          title: remote?.name,
          icon: remote?.icon,
          order: remote?.sort,
        },
        tab: {
          title: remote?.name,
          icon: remote?.icon,
        },
      });
    });
  },
});
