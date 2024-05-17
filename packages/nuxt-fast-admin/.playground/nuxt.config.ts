export default defineNuxtConfig({
  extends: [".."],
  openFetch: {
    clients: {
      petstore3: {
        baseURL: "https://petstore3.swagger.io/api/v3",
        schema: "https://petstore3.swagger.io/api/v3/openapi.json",
      },
    },
  },
});
