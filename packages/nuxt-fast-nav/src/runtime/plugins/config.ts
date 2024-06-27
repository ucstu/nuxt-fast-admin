import { defineNuxtPlugin } from "#app";
import { getRouteMetas as getRouteMeta } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  async setup(nuxtApp) {
    nuxtApp.hook("fast-utils:route", async (route, meta) => {
      Object.assign(meta, getRouteMeta(route));
    });
  },
});
