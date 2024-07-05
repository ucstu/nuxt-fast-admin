import {
  addImportsSources,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  installModule,
  updateTemplates,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { minimatch } from "minimatch";
import { name, version } from "../package.json";
import type { createNavHistories, createNavMenus } from "./runtime/composables";
import type {
  FsNavConfig,
  FsNavConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

const configKey = "fastNav";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
  },
  defaults: {
    check: {
      parent: true,
    },
    autoFillMeta: true,
  } satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    installModule("@ucstu/nuxt-fast-utils");
    installModule("@ucstu/nuxt-fast-route");

    const options = _options as ModuleOptionsDefaults;

    const { resolve } = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public[configKey] = options;

    nuxt.options.appConfig[configKey] = {
      menus: [],
      menu: {
        icon: "material-symbols:lists",
        show: false,
        disabled: false,
        order: 0,
      },
      page: {
        icon: "material-symbols:pages",
        menu: {
          has: true,
          show: true,
          disabled: false,
          order: 0,
        },
        tab: {
          has: true,
          show: true,
        },
      },
      home: "/",
      keys: ["hash", "name", "params", "path", "query"],
    } satisfies FsNavConfigDefaults;

    addTemplate({
      write: true,
      filename: "types/ucstu/nuxt-fast-nav/menu-key.ts",
      getContents({ app }) {
        const result: Record<string, any> = {};
        const pages = app.pages || [];
        for (const page of pages) {
          if (page.children?.length) {
            pages.push(...page.children);
          }
          if (page.name) {
            const paths = page.name.split("-").slice(0, -1);
            let parent = result;
            for (const path of paths) {
              const _path = encodeURI(path);
              if (!parent[_path]) {
                parent[_path] = {};
              }
              parent = parent[_path];
            }
          }
        }
        const _interface = JSON.stringify(result, null, 2).replaceAll(
          "{}",
          "never",
        );
        return `export interface _FsNavMenuKeys ${
          _interface === "never" ? "{}" : _interface
        };`;
      },
    });

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      __dirname,
      getContents({ nuxt, options }) {
        return `import type { _FsNavMenuKeys } from "./nuxt-fast-nav/menu-key";
declare module "${options.moduleName}" {
  interface FsNavMenuKeys extends _FsNavMenuKeys {}
}

import type { FsNavPage } from "${options.moduleName}";
declare module "${resolve(
          nuxt.options.appDir,
          "../pages/runtime/composables",
        )}" {
  interface PageMeta extends FsNavPage {}
}
`;
      },
    });

    const needUpdateTemplates = ["types/ucstu/nuxt-fast-nav/menu-key.ts"];
    nuxt.hook("builder:watch", (event, relativePath) => {
      if (minimatch(relativePath, "pages/**/*")) {
        updateTemplates({
          filter(template) {
            return needUpdateTemplates.includes(template.filename);
          },
        });
      }
    });

    if (options.autoFillMeta) {
      addPlugin({
        name: `${name}:config`,
        src: resolve("./runtime/plugins/config"),
      });
    }

    addPlugin({
      name,
      src: resolve("./runtime/plugins/plugin"),
    });

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: ["useNavMenus", "useNavHistories"],
    });
  },
});

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    [configKey]?: FsNavConfig;
  }
}

declare module "#app" {
  interface NuxtApp {
    $fastNav: {
      menus: ReturnType<typeof createNavMenus>;
      histories: ReturnType<typeof createNavHistories>;
    };
  }
}
