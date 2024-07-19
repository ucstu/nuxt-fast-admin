import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-auth:sign-in", (form, result) => {
      result.value = "token";
    });
    nuxtApp.hook("fast-nav:get-pages", (pages) => {
      pages.value.push({
        menu: {
          parent: "$root",
        },
        type: "crud",
        to: "/crud/1/2",
      });
    });
  },
});
