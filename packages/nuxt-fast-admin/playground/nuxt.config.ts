export default defineNuxtConfig({
  modules: ["../src/module"],
  devtools: { enabled: true },
  fastAdmin: {
    modules: ["auth", "crud", "fetch"],
  },
});
