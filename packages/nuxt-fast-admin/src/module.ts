import {
  addComponent,
  addComponentsDir,
  addImportsSources,
  addLayout,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendPages,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import {
  configKey,
  defaults,
  initModule,
  name,
  version,
} from "./runtime/config";
import type { ModuleOptions } from "./runtime/types";

export type {
  ModuleOptions,
  ModulePublicRuntimeConfig,
  ModuleRuntimeHooks,
} from "./runtime/types/module";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
  },
  defaults,
  async setup(_options, nuxt) {
    await installModule("@nuxt/icon");
    await installModule("@ucstu/nuxt-fast-nav");
    await installModule("@ucstu/nuxt-fast-utils");
    await installModule("@ucstu/nuxt-naive-ui");

    if (__dirname.replace(process.cwd(), "").startsWith("/src")) {
      await installModule("@ucstu/nuxt-amis");
      await installModule("@ucstu/nuxt-fast-auth");
      await installModule("@ucstu/nuxt-fast-crud");
      await installModule("@ucstu/nuxt-fast-fetch");
    }

    const options = initModule(_options, nuxt);
    options.modules ??= [];
    options.modules.push(
      ...nuxt.options._installedModules.map((m) => m.meta.name)
    );

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      configKey,
      __dirname,
    });

    const { resolve } = createResolver(import.meta.url);

    // 如果安装了 fast-nav 模块，则安装对应插件
    if (options.modules.includes("@ucstu/nuxt-fast-auth")) {
      // 添加 auth 插件
      addPlugin({
        name: `${name}:auth`,
        src: resolve("./runtime/plugins/auth"),
      });
      // 添加 auth-nav 插件
      addPlugin({
        name: `${name}:auth-nav`,
        src: resolve("./runtime/plugins/auth-nav"),
      });
      // 如果同时安装了 fast-fetch 模块，则添加 auth-fetch 插件
      if (options.modules.includes("@ucstu/nuxt-fast-fetch")) {
        addPlugin({
          name: `${name}:auth-fetch`,
          src: resolve("./runtime/plugins/auth-fetch"),
        });
      }
      // 注册 auth 页面组件
      addComponent({
        filePath: resolve("./runtime/components/fa/pages/auth.vue"),
        name: "FaPagesAuth",
      });
      // 如果开启了 auth 页面，则添加 auth 页面
      if (options.features.pages.auth) {
        extendPages((pages) => {
          if (pages.length === 0) return;
          pages.push({
            file: resolve("./runtime/pages/auth.vue"),
            path: "/auth",
            name: "auth",
            meta: {
              title: "登录",
              layout: "full",
              auth: false,
              menu: {
                show: false,
              },
              tab: {
                show: false,
              },
            },
          });
        });
      }
    }

    // 如果安装了 fast-crud 模块
    if (options.modules.includes("@ucstu/nuxt-fast-crud")) {
      // 如果同时安装了 fast-fetch 模块，则添加 CRUD 页面
      if (options.modules.includes("@ucstu/nuxt-fast-fetch")) {
        // 添加 CRUD 页面组件
        addComponent({
          filePath: resolve("./runtime/components/fa/pages/crud.vue"),
          name: "FaPagesCrud",
          mode: "client",
        });
        // 如果开启了 CRUD 页面，则添加 CRUD 页面
        if (options.features.pages.crud) {
          extendPages((pages) => {
            if (pages.length === 0) return;
            pages.push({
              file: resolve("./runtime/pages/crud.vue"),
              path: "/crud/:api()/:resource()",
              name: "crud-api-resource",
              meta: {
                title: "资源",
                menu: {
                  show: false,
                },
                tab: {
                  show: false,
                },
              },
            });
          });
        }
      }
    }

    // 如果安装了 amis 模块
    if (options.modules.includes("@ucstu/nuxt-amis")) {
      addComponent({
        filePath: resolve("./runtime/components/fa/pages/amis.vue"),
        name: "FaPagesAmis",
        mode: "client",
      });
      // 如果开启了 amis 页面，则添加 amis 页面
      if (options.features.pages.amis) {
        extendPages((pages) => {
          if (pages.length === 0) return;
          pages.push({
            file: resolve("./runtime/pages/amis.vue"),
            path: "/amis/:key()",
            name: "amis-key",
            meta: {
              title: "Amis",
              menu: {
                show: false,
              },
              tab: {
                show: false,
              },
            },
          });
        });
      }
    }

    // 添加 iframe 页面组件
    addComponent({
      filePath: resolve("./runtime/components/fa/pages/iframe.vue"),
      name: "FaPagesIframe",
      mode: "client",
    });
    // 如果开启了 iframe 页面，则添加 iframe 页面
    if (options.features.pages.iframe) {
      extendPages((pages) => {
        if (pages.length === 0) return;
        pages.push({
          file: resolve("./runtime/pages/iframe.vue"),
          path: "/iframe",
          name: "iframe",
          meta: {
            title: "Iframe",
            menu: {
              show: false,
            },
            tab: {
              show: false,
            },
          },
        });
      });
    }

    if (options.features.layouts.full) {
      addLayout(resolve("./runtime/layouts/full.vue"), "full");
    }
    if (options.features.layouts.default) {
      addLayout(resolve("./runtime/layouts/default.vue"), "default");
    }

    addPlugin({
      name: `${name}:nav`,
      src: resolve("./runtime/plugins/nav"),
    });

    addComponentsDir({
      path: resolve("./runtime/components"),
      ignore: ["fa/pages/*.vue", "fa/app.vue", "fa/app-crud.vue"],
    });

    if (options.modules.includes("@ucstu/nuxt-fast-crud")) {
      addComponent({
        filePath: resolve("./runtime/components/fa/app-crud.vue"),
        name: "FaApp",
      });
    } else {
      addComponent({
        filePath: resolve("./runtime/components/fa/app.vue"),
        name: "FaApp",
      });
    }

    addImportsSources({
      from: resolve("./runtime/composables/menu"),
      imports: ["getAdminMenu", "useAdminMenu", "useAdminMenuGlobal"],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: ["isFetchError", "handleError"],
    });
  },
});
