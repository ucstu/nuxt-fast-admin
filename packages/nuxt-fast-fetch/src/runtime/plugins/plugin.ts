import { defineNuxtPlugin } from "#app";
import * as apis from "#fast-fetch";
import { useRuntimeConfig } from "#imports";
import { client } from "@hey-api/client-fetch";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig();
    for (const [name, api] of Object.entries(apis)) {
      if (typeof api === "object" && api !== null && "OpenAPI" in api) {
        (api.OpenAPI as any).BASE =
          runtimeConfig.public.fastFetch.clients[name.slice(1)].baseUrl;
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
        client.getConfig().baseUrl =
          runtimeConfig.public.fastFetch.clients[name.slice(1)].baseUrl;
        client.interceptors.request.use(async (request, options) => {
          await nuxtApp.callHook("fast-fetch:request", name, {
            type: "client",
            request,
            options,
          });
          return request;
        });
        client.interceptors.response.use(async (response, request, options) => {
          await nuxtApp.callHook("fast-fetch:response", name, {
            type: "client",
            request,
            response,
            options,
          });
          return response;
        });
      }
    }
  },
});
