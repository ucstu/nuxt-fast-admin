export default defineNuxtConfig({
  modules: [
    "@ucstu/nuxt-amis",
    "@ucstu/nuxt-fast-auth",
    "@ucstu/nuxt-fast-crud",
    "nuxt-open-fetch",
    "../src/module",
  ],
  devtools: { enabled: true },
  openFetch: {
    disableNuxtPlugin: true,
    clients: {
      petStore: {
        baseURL: "https://petstore3.swagger.io/api/v3",
        schema: "https://petstore3.swagger.io/api/v3/openapi.json",
      },
    },
  },
});
