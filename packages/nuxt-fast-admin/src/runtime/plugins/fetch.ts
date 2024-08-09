import { defineNuxtPlugin, type NuxtApp } from "#app";
import {
  createOpenFetch,
  handleError,
  useModuleConfig,
  useRequestFetch,
  useRuntimeConfig,
} from "#imports";
import defu from "defu";
import { FetchError, type FetchOptions } from "ofetch";
import { configKey } from "../config";
import { _token } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const clients = useRuntimeConfig().public.openFetch as Record<
      string,
      FetchOptions
    >;
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
                  headers: _token.value?.value
                    ? {
                        [adminConfig.value.fetch.token.name]:
                          `${adminConfig.value.fetch.token.type} ${_token.value.value}`,
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
