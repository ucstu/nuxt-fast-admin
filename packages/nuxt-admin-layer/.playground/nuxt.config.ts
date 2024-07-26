export default defineNuxtConfig({
  extends: [".."],
  modules: [
    "@nuxt/eslint",
    "@ucstu/nuxt-amis",
    "@ucstu/nuxt-fast-auth",
    "@ucstu/nuxt-fast-crud",
    "nuxt-open-fetch",
  ],
});
