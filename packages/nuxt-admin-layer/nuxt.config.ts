export default defineNuxtConfig({
  modules: ["@ucstu/nuxt-fast-admin"],
  devtools: { enabled: true },

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  openFetch: {
    disableNuxtPlugin: true,
  },

  compatibilityDate: "2024-08-24",
});
