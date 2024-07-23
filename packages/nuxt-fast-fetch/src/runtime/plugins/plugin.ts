import { defineNuxtPlugin } from "#app";
import * as apis from "#fast-fetch-core";
import { useRuntimeConfig } from "#imports";
import type { Client as AxiosClient } from "@hey-api/client-axios";
import type { Client as FetchClient } from "@hey-api/client-fetch";

export default defineNuxtPlugin({
  enforce: "pre",
  async setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig();
    for (const [name, api] of Object.entries(apis)) {
      const config = (runtimeConfig.public.fastFetch.clients as any)[
        name.slice(1)
      ];
      if (typeof api === "object" && api !== null) {
        if ("OpenAPI" in api) {
          (api.OpenAPI as any).BASE =
            config.baseUrl ?? (api.OpenAPI as any).BASE;
          (api.OpenAPI as any).interceptors.request.use(
            async (request: RequestInit) => {
              await nuxtApp.callHook("fast-fetch:request", name, {
                type: "legacy",
                request,
              });
              return request;
            }
          );
          (api.OpenAPI as any).interceptors.response.use(
            async (response: Response) => {
              await nuxtApp.callHook("fast-fetch:response", name, {
                type: "legacy",
                response,
              });
              return response;
            }
          );
        } else {
          if ("client" in api) {
            switch (config.client) {
              case "@hey-api/client-fetch": {
                const client = api.client as unknown as FetchClient;
                client.getConfig().baseUrl =
                  config.baseUrl ?? client.getConfig().baseUrl;
                client.interceptors.request.use(async (request, options) => {
                  await nuxtApp.callHook("fast-fetch:request", name, {
                    type: "client-fetch",
                    request,
                    options,
                  });
                  return request;
                });
                client.interceptors.response.use(
                  async (response, request, options) => {
                    await nuxtApp.callHook("fast-fetch:response", name, {
                      type: "client-fetch",
                      request,
                      response,
                      options,
                    });
                    return response;
                  }
                );
                break;
              }
              case "@hey-api/client-axios": {
                const client = api.client as unknown as AxiosClient;
                client.getConfig().baseURL =
                  config.baseUrl ?? client.getConfig().baseURL;

                client.instance.interceptors.request.use(
                  async function (request) {
                    await nuxtApp.callHook("fast-fetch:request", name, {
                      type: "client-axios",
                      request,
                    });
                    return request;
                  },
                  async function (error) {
                    await nuxtApp.callHook("fast-fetch:request", name, {
                      type: "client-axios",
                      error,
                    });
                    return Promise.reject(error);
                  }
                );
                client.instance.interceptors.response.use(
                  async function (response) {
                    await nuxtApp.callHook("fast-fetch:response", name, {
                      type: "client-axios",
                      response,
                    });
                    return response;
                  },
                  async function (error) {
                    await nuxtApp.callHook("fast-fetch:response", name, {
                      type: "client-axios",
                      error,
                    });
                    return Promise.reject(error);
                  }
                );
                break;
              }

              default:
                break;
            }
          }
        }
      }
    }
  },
});
