export default defineNuxtConfig({
  modules: [
    "@ucstu/nuxt-fast-auth",
    "@ucstu/nuxt-fast-crud",
    "@ucstu/nuxt-fast-fetch",
    "../src/module",
  ],
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
