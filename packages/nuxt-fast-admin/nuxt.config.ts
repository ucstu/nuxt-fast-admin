// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "nuxt-icon",
    "nuxt-open-fetch",
    "@ucstu/nuxt-fast-auth",
    "@ucstu/nuxt-fast-crud",
    "@ucstu/nuxt-fast-nav",
    "@ucstu/nuxt-naive-ui",
  ],
  openFetch: {
    disableNuxtPlugin: true,
  },
});
