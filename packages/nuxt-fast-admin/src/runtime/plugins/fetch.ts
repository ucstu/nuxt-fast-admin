import { defineNuxtPlugin, useNuxtApp, type NuxtApp } from "#app";
import {
  createOpenFetch,
  handleError,
  shallowRef,
  useModuleConfig,
  useRequestFetch,
  useRuntimeConfig,
} from "#imports";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { FetchError, type FetchOptions } from "ofetch";
import { configKey } from "../config";
import { _token } from "../utils";

function getFetchOptions(
  name: string,
  options: FetchOptions,
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  const _result = shallowRef<FetchOptions>(options);
  const result = extendRef(_result, {
    merge(value: Partial<FetchOptions>, order: "before" | "after" = "before") {
      _result.value = (
        order === "before"
          ? defu(value, _result.value)
          : defu(_result.value, value)
      ) as FetchOptions;
    },
  });
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    "fast-admin:get-fetch-options",
    name,
    options,
    result,
  );
  return result.value;
}

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
          [name]: createOpenFetch((localOptions) => {
            const result = defu<FetchOptions, Array<FetchOptions>>(
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
            ) as FetchOptions;
            return getFetchOptions(name, result, nuxtApp as NuxtApp);
          }, localFetch),
        }),
        {},
      ),
    };
  },
});
