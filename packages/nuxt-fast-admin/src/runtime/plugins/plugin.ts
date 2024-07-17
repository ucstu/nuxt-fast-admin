import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  async setup(nuxtApp) {
    await nuxtApp.callHook("fast-admin:register-crud-resource", () => {
      result.value = input?.title
        ? `${input.title} - Fast Admin`
        : "Fast Admin";
    });
  },
});
