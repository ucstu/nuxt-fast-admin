import { callWithNuxt } from "#app";
import defu from "defu";
import { dateZhCN, zhCN } from "naive-ui";
import { FetchError, type FetchOptions, type ResponseType } from "ofetch";
import { name } from "../package.json";

export default defineNuxtPlugin({
  name,
  enforce: "pre",
  async setup(nuxtApp) {
    const { refreshMenus } = useNav();
    const runtimeConfig = useRuntimeConfig();
    const { token, user, getUser } = useAuth();
    const adminConfig = refAppConfig("fastAdmin");

    if (adminConfig.value.app!.head) {
      addRouteMiddleware((to) => {
        const name = adminConfig.value.name;
        const title = to.meta.tab?.title ?? to.meta.title ?? "";
        useHead({
          title: title ? `${title} - ${name}` : name,
        });
      });
    }

    updateAppConfig({
      fastAdmin: {
        app: {
          naiveConfig: {
            locale: zhCN,
            dateLocale: dateZhCN,
          },
        },
      },
    });

    if (!user.value && token.value) {
      await getUser();
    }
    watch(user, refreshMenus, { deep: true, immediate: true });

    return {
      provide: Object.fromEntries(
        Object.entries(runtimeConfig.public.openFetch).map(
          ([name, options1]) => [
            name,
            createOpenFetch((options2) => {
              const { token } = useAuth();

              const options = defu<
                FetchOptions<ResponseType>,
                Array<FetchOptions<ResponseType>>
              >(options1, options2, {
                headers: token.value
                  ? {
                      [adminConfig.value.fetch!.token!.name!]: `${
                        adminConfig.value.fetch!.token!.type
                      } ${token.value}`,
                    }
                  : undefined,
                onRequestError(ctx) {
                  callWithNuxt(nuxtApp, () =>
                    handleError(ctx.error, ctx.options.config?.error),
                  );
                },
                onResponseError(ctx) {
                  const error = new FetchError("Response Error");
                  error.statusCode = ctx.response.status;
                  error.statusMessage = ctx.response.statusText;
                  error.response = ctx.response;
                  callWithNuxt(nuxtApp, () =>
                    handleError(error, ctx.options.config?.error),
                  );
                },
              });

              return adminConfig.value.hooks!.fetchOptions
                ? (callWithNuxt(nuxtApp, () =>
                    adminConfig.value.hooks!.fetchOptions!(options),
                  ) as FetchOptions<ResponseType>)
                : options;
            }),
          ],
        ),
      ),
    };
  },
});
