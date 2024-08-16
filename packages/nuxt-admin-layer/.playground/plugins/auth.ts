import type { components } from "#open-fetch-schemas/fims";

type User = components["schemas"]["User"];

declare module "@ucstu/nuxt-fast-auth/types" {
  interface FastAuthUser extends User {}
}

export default defineNuxtPlugin({
  enforce: "pre",
  async setup() {
    const nuxtApp = useNuxtApp();
    const { signOut, changeRole } = useAuth();
    const config = useModuleConfig("fastAuth");
    const { data: pages, refresh: refreshPages, error } = await usePages();

    if (config.value.page.auth instanceof Object) {
      config.value.page.auth = {
        ...config.value.page.auth,
        auth: role("developer"),
      };
    }

    if (error.value?.statusCode === 401 || error.value?.statusCode === 403) {
      await signOut({ navigate: true });
    }

    nuxtApp.hook("fast-auth:sign-in", async (form, result) => {
      const res = await nuxtApp.$fims("/auth/login", {
        method: "POST",
        body: form,
      });
      result.value = res.token;
    });
    nuxtApp.hook("fast-auth:get-user", async (token, result) => {
      if (!token) {
        return (result.value = undefined);
      }
      changeRole("*");
      await refreshPages();
      result.value = await nuxtApp.$fims("/auth/session");
    });
    nuxtApp.hook("fast-auth:get-roles", async (user, result) => {
      if (!user) {
        return (result.value = []);
      }
      result.value.push(...(user.roles?.map((role) => role.code) ?? []));
    });
    nuxtApp.hook("fast-auth:get-permissions", async (user, _role, result) => {
      if (!user) {
        return (result.value = []);
      }
      result.value.push(
        ...(user.permissions ?? [])
          .concat(
            (
              user.roles?.filter(
                (role) => role.code === _role || _role === "*"
              ) ?? []
            )
              .flatMap((role) => role.permissions)
              .filter((permission) => permission !== undefined)
          )
          .map((permission) => permission.code)
      );
    });
    nuxtApp.hook("fast-auth:get-page", (page, result) => {
      if (result.value.auth.auth === false) return;
      const remote = pages.value?.content?.find(
        (p) => p.path === getToPath(page.to)
      );
      result.value.auth.auth = [
        "|",
        role("developer"),
        remote?.permission?.code ?? result.value.auth.auth,
      ].filter((value) => value !== undefined);
    });
  },
});
