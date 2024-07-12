import { resolve } from "pathe";

export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxt/devtools-ui-kit"],

  nitro: {
    output: {
      publicDir: resolve(__dirname, "../dist/client"),
    },
  },

  app: {
    baseURL: "/__fast-fetch",
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["rapi-doc"].includes(tag),
    },
  },
});
