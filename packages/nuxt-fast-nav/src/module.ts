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
import { configKey, defaults, initModule, name, version } from "./config";
import type { ModuleOptions } from "./runtime/types";

export type * from "./runtime/types/module";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
  },
  defaults,
  setup(_options, nuxt) {
    installModule("@ucstu/nuxt-fast-utils");

    const options = initModule(_options, nuxt);

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      configKey,
      __dirname,
      getContents({ nuxt, options }) {
        return `import type { _FastNavMenuKeys } from "./nuxt-fast-nav/menu-key";
declare module "${options.moduleName}" {
  interface FastNavMenuKeys extends _FastNavMenuKeys {}
}

import type { FastNavPage } from "${options.moduleName}";
declare module "${resolve(
          nuxt.options.appDir,
          "../pages/runtime/composables"
        )}" {
  interface PageMeta extends Omit<FastNavPage, "type" | "to"> {}
}
`;
      },
    });

    const { resolve } = createResolver(import.meta.url);

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
          "never"
        );
        return `export interface _FastNavMenuKeys ${
          _interface === "never" ? "{}" : _interface
        };`;
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
      imports: ["useNavMenus", "useNavPages", "useNavHistories"],
    });

    addImportsSources({
      from: resolve("./runtime/utils"),
      imports: ["toEqual"],
    });
  },
});
