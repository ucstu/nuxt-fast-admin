import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("fast-auth:sign-in", (form, result) => {
      result.value = "token";
    });
    nuxtApp.hook("fast-nav:get-pages", (pages) => {
      pages.value.push(
        {
          title: "百度",
          icon: "ic:sharp-dashboard",
          type: "iframe",
          to: {
            path: "/iframe",
            query: {
              url: "https://www.baidu.com/?foo=foo#/foo/bar?test=test#ok",
            },
          },
          menu: {
            parent: "$root",
          },
        },
        {
          title: "QQ",
          icon: "ic:sharp-dashboard",
          type: "iframe",
          to: {
            path: "/iframe",
            query: {
              url: "https://www.qq.com",
            },
          },
          menu: {
            parent: "$root",
          },
        },
        {
          title: "Amis",
          icon: "ic:sharp-dashboard",
          type: "amis",
          to: {
            path: "/amis/key",
          },
          menu: {
            parent: "$root",
          },
        },
        {
          title: "Crud",
          icon: "ic:sharp-dashboard",
          type: "crud",
          to: {
            path: "/crud/api/resource",
          },
          menu: {
            parent: "$root",
          },
        },
      );
    });
  },
});
