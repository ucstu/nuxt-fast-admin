import {
  addImportsSources,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
  updateTemplates,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { genAugmentation, genTypeImport } from "knitwork";
import { minimatch } from "minimatch";
import {
  configKey,
  defaults,
  initModule,
  name,
  version,
} from "./runtime/config";
import type { ModuleOptions } from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
  },
  defaults,
  async setup(_options, nuxt) {
    await installModule("@ucstu/nuxt-fast-utils");

    const options = initModule(_options, nuxt);

    const { resolve } = createResolver(import.meta.url);

    const pageModule = resolve(
      nuxt.options.appDir,
      "../pages/runtime/composables",
    );

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      configKey,
      __dirname,
      getContents({ options: { moduleName } }) {
        return `${genTypeImport("./nuxt-fast-nav/menu-key", [
          "_FastNavMenuKeys",
        ])}
${genAugmentation(moduleName, {
  FastNavMenuKeys: [
    {},
    {
      extends: "_FastNavMenuKeys",
    },
  ],
})}

${genTypeImport(moduleName, ["FastNavPage"])}
${genAugmentation(pageModule, {
  PageMeta: [
    {},
    {
      extends: 'Omit<FastNavPage, "type" | "to">',
    },
  ],
})}`;
      },
    });

    addTemplate({
      write: true,
      filename: "types/ucstu/nuxt-fast-nav/menu-key.ts",
      getContents({ app }) {
        const result: Record<string, unknown> = {};
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
              parent = parent[_path] as Record<string, unknown>;
            }
          }
        }
        const _interface = JSON.stringify(result, null, 2).replaceAll(
          "{}",
          "never",
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

    if (process.env.NODE_ENV === "development") {
      const optimizeDeps = ["minimatch"];
      extendViteConfig((config) => {
        config.optimizeDeps ||= {};
        config.optimizeDeps.include ||= [];
        for (const item of optimizeDeps) {
          if (!config.optimizeDeps.include.includes(item)) {
            config.optimizeDeps.include.push(`${name} > ${item}`);
          }
        }
      });
      const transpile = ["minimatch"];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    } else {
      const transpile = ["minimatch"];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    }

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
      imports: ["isNavMenu", "isNavPage", "isNavMenuFilled", "isNavPageFilled"],
    });
  },
});
