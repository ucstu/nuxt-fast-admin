// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  extends: [".."],

  modules: [
    "@ucstu/nuxt-amis",
    "@ucstu/nuxt-fast-auth",
    "@ucstu/nuxt-fast-crud",
    "nuxt-open-fetch",
  ],

  hooks: {
    "prerender:routes"({ routes }) {
      routes.clear();
    },
  },

  openFetch: {
    clients: {
      fims: {
        baseURL: "http://localhost:8080",
        schema: "http://localhost:8080/v3/api-docs",
      },
    },
  },

  fastAdmin: {
    features: {
      pages: {
        auth: false,
      },
    },
  },

  compatibilityDate: "2024-08-14",
});
