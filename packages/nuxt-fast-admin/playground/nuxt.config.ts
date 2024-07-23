export default defineNuxtConfig({
  modules: [
    "@ucstu/nuxt-amis",
    "@ucstu/nuxt-fast-auth",
    "@ucstu/nuxt-fast-crud",
    "nuxt-open-fetch",
    "../src/module",
  ],
  devtools: { enabled: true },
  fastFetch: {
    clients: {
      petStore: {
        baseUrl: "https://petstore3.swagger.io/api/v3",
        input: "https://petstore3.swagger.io/api/v3/openapi.json",
      },
    },
  },
});
