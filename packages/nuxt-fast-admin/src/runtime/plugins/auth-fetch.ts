import { defineNuxtPlugin } from "#app";
import { useAuth, useModuleConfig } from "#imports";
import { configKey } from "../config";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const { token } = useAuth();
    const adminConfig = useModuleConfig(configKey);

    nuxtApp.hook("fast-fetch:request", (api, options) => {
      const { name, type } = adminConfig.value.fetch.token;

      if (!token.value?.value) return;

      if (options.type === "fetch") {
        const { request } = options;
        request.headers.set(name, `${type} ${token.value.value}`);
      } else if (options.type === "axios") {
        if ("request" in options) {
          options.request.headers.set(name, `${type} ${token.value.value}`);
        }
      } else {
        const { request } = options;
        if (Array.isArray(request.headers)) {
          request.headers.push([name, `${type} ${token.value.value}`]);
        } else if (request.headers instanceof Headers) {
          request.headers.set(name, `${type} ${token.value.value}`);
        } else {
          request.headers ??= {};
          request.headers[name] = `${type} ${token.value.value}`;
        }
      }
    });
  },
});
