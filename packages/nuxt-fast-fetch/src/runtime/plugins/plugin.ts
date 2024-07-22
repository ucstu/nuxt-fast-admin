import { defineNuxtPlugin } from "#app";
import * as apis from "#fast-fetch";
import { useRuntimeConfig } from "#imports";
import {
  createClient as createAxiosClient,
  type Client as AxiosClient,
} from "@hey-api/client-axios";
import {
  createClient as createFetchClient,
  type Client as FetchClient,
} from "@hey-api/client-fetch";

const fetchClients: Record<string, FetchClient> = {};
const axiosClients: Record<string, AxiosClient> = {};

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig();
    for (const [name, api] of Object.entries(apis)) {
      if (typeof api === "object" && api !== null && "OpenAPI" in api) {
        (api.OpenAPI as any).BASE = (
          runtimeConfig.public.fastFetch.clients as any
        )[name.slice(1)].baseUrl;
        (api.OpenAPI as any).interceptors.request.use(
          async (request: RequestInit) => {
            await nuxtApp.callHook("fast-fetch:request", name, {
              type: "legacy",
              request,
            });
            return request;
          },
        );
        (api.OpenAPI as any).interceptors.response.use(
          async (response: Response) => {
            await nuxtApp.callHook("fast-fetch:response", name, {
              type: "legacy",
              response,
            });
            return response;
          },
        );
      } else {
        let client = (runtimeConfig.public.fastFetch.clients as any)[
          name.slice(1)
        ].client;
        client = typeof client === "string" ? client : client.name;
        switch (client) {
          case "@hey-api/client-fetch":
            fetchClients[name] = createFetchClient({
              baseUrl: (runtimeConfig.public.fastFetch.clients as any)[
                name.slice(1)
              ].baseUrl,
            });
            fetchClients[name].interceptors.request.use(
              async (request, options) => {
                await nuxtApp.callHook("fast-fetch:request", name, {
                  type: "fetch",
                  request,
                  options,
                });
                return request;
              },
            );
            fetchClients[name].interceptors.response.use(
              async (response, request, options) => {
                await nuxtApp.callHook("fast-fetch:response", name, {
                  type: "fetch",
                  request,
                  response,
                  options,
                });
                return response;
              },
            );
            break;
          case "@hey-api/client-axios":
            axiosClients[name] = createAxiosClient({
              baseURL: (runtimeConfig.public.fastFetch.clients as any)[
                name.slice(1)
              ].baseUrl,
            });
            axiosClients[name].instance.interceptors.request.use(
              async (request) => {
                await nuxtApp.callHook("fast-fetch:request", name, {
                  type: "axios",
                  request,
                });
                return request;
              },
              async (error) => {
                await nuxtApp.callHook("fast-fetch:request", name, {
                  type: "axios",
                  error,
                });
                return Promise.reject(error);
              },
            );
            axiosClients[name].instance.interceptors.response.use(
              async (response) => {
                await nuxtApp.callHook("fast-fetch:response", name, {
                  type: "axios",
                  response,
                });
                return response;
              },
              async (error) => {
                await nuxtApp.callHook("fast-fetch:response", name, {
                  type: "axios",
                  error,
                });
                return Promise.reject(error);
              },
            );
            break;
          default:
            break;
        }
      }
    }
  },
});
