export default defineNuxtConfig({
  modules: ["../dist/module"],
  devtools: { enabled: true },
  fastFetch: {
    clients: {
      petStore: {
        input: "https://petstore3.swagger.io/api/v3/openapi.json",
      },
      personStore: {
        input:
          "C:\\Users\\TMK\\ZXD\\nuxt-fast-admin\\packages\\nuxt-fast-fetch\\playground\\openapi.json",
      },
    },
  },
});
