import {
  addImportsSources,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  installModule,
  updateTemplates,
} from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { minimatch } from "minimatch";
import { name, version } from "../package.json";
import type {
  FsNavConfig,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "fastNav",
  },
  defaults: {
    check: {
      parent: true,
    },
  } satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    installModule("@ucstu/nuxt-fast-utils");

    const options = _options as ModuleOptionsDefaults;

    const { resolve } = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.fastNav = options;

    nuxt.options.appConfig.fastNav = {
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
    } satisfies AppConfigInput["fastNav"];

    addTemplate({
      write: true,
      filename: "types/ucstu/nuxt-fast-nav/menu-key.ts",
      async getContents({ app }) {
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
          "never"
        );
        return `export interface _FsNavMenuKey ${
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
        return `import type { _FsNavMenuKey } from "./nuxt-fast-nav/menu-key";
declare module "${options.moduleName}" {
  interface FsNavMenuKey extends _FsNavMenuKey {}
}

import type { FsNavPage } from "${options.moduleName}";
declare module "${resolve(
          nuxt.options.appDir,
          "../pages/runtime/composables"
        )}" {
  interface PageMeta extends FsNavPage {}
}
`;
      },
    });

    const needUpdateTemplates = ["types/ucstu/nuxt-fast-nav/menu-key.ts"];
    nuxt.hook("builder:watch", async (event, relativePath) => {
      if (minimatch(relativePath, "pages/**/*")) {
        updateTemplates({
          filter(template) {
            return needUpdateTemplates.includes(template.filename);
          },
        });
      }
    });

    addPlugin({
      name: `${name}:config`,
      src: resolve("./runtime/plugins/config"),
    });

    addPlugin({
      name,
      src: resolve("./runtime/plugins/plugin"),
    });

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: ["useNav"],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: ["isFsNavMenu", "isFsNavPage"],
    });
  },
});

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    fastNav?: FsNavConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    fastNav?: FsNavConfig;
  }
}
