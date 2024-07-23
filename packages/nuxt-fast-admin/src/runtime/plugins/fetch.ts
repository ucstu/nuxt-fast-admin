import { createError, defineNuxtPlugin } from "#app";
import { handleError } from "#imports";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-fetch:response", (api, options) => {
      switch (options.type) {
        case "client-fetch": {
          const { response } = options;
          if (!response.ok) {
            handleError(
              createError({
                statusCode: response.status,
                statusMessage: response.statusText,
                message: response.statusText,
              })
            );
          }
          break;
        }
        case "client-axios": {
          if ("error" in options) {
            options.error;
          }
          break;
        }

        default:
          break;
      }
    });
  },
});
