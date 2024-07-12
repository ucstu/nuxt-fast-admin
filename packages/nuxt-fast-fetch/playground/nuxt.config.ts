export default defineNuxtConfig({
  modules: ["../src/module"],
  devtools: { enabled: true },

  fastFetch: {
    clients: {
      petStore: {
        input: "https://petstore3.swagger.io/api/v3/openapi.json",
      },
      personStore: {
        input: "https://petstore3.swagger.io/api/v3/openapi.json",
      },
    },
  },
});
