import { defineNuxtPlugin, type NuxtApp } from "#app";
import {
  createOpenFetch,
  handleError,
  useAuth,
  useModuleConfig,
  useRequestFetch,
  useRuntimeConfig,
  type Ref,
} from "#imports";
import defu from "defu";
import { FetchError, type FetchOptions } from "ofetch";
import { configKey } from "../config";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const { token } = useAuth() as { token: Ref<{ value: string }> };
    const clients = useRuntimeConfig().public.openFetch;
    const localFetch = useRequestFetch();
    const adminConfig = useModuleConfig(configKey);

    return {
      provide: Object.entries(clients).reduce(
        (acc, [name, options]) => ({
          ...acc,
          [name]: createOpenFetch(
            (localOptions) =>
              defu<FetchOptions, Array<FetchOptions>>(
                localOptions,
                options as FetchOptions,
                {
                  headers: token.value.value
                    ? {
                        [adminConfig.value.fetch.token.name]:
                          `${adminConfig.value.fetch.token.type} ${token.value.value}`,
                      }
                    : undefined,
                  onRequestError(ctx) {
                    handleError(
                      ctx.error,
                      ctx.options.options?.error,
                      nuxtApp as NuxtApp,
                    );
                  },
                  onResponseError(ctx) {
                    const error = new FetchError("Response Error");
                    error.statusCode = ctx.response.status;
                    error.statusMessage = ctx.response.statusText;
                    error.response = ctx.response;
                    handleError(
                      error,
                      ctx.options.options?.error,
                      nuxtApp as NuxtApp,
                    );
                  },
                },
              ) as FetchOptions,
            localFetch,
          ),
        }),
        {},
      ),
    };
  },
});
