// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@ucstu/nuxt-amis",
    "@ucstu/nuxt-fast-auth",
    "@ucstu/nuxt-fast-crud",
    "nuxt-open-fetch",
  ],
  extends: ["@ucstu/nuxt-admin-layer"],
});
