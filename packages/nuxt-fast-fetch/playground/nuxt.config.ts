export default defineNuxtConfig({
  modules: ["../dist/module"],
  devtools: { enabled: true },
  fastFetch: {
    clients: {
      petStore: {
        baseUrl: "https://petstore3.swagger.io/api/v3",
        input: "https://petstore3.swagger.io/api/v3/openapi.json",
        client: "@hey-api/client-fetch",
      },
    },
  },
});
