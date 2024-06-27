import { defineNuxtPlugin } from "#app";
import { fuHooks } from "#imports";
import type { FsNavPage } from "../types";
import { getPageFilled } from "../utils";

declare module "#vue-router" {
  interface RouteMeta extends FsNavPage {}
}

export default defineNuxtPlugin({
  enforce: "pre",
  async setup() {
    fuHooks.hook("fast-utils:page-meta", async (meta, route) => {
      return (await getPageFilled(route)) || {};
    });
  },
});
