import {
  addImportsSources,
  addPlugin,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  updateTemplates,
} from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import { minimatch } from "minimatch";
import { name, version } from "../package.json";
import type { ModuleOptions, ModuleOptionsDefaults } from "./runtime/types";

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
    const options = _options as ModuleOptionsDefaults;
    const { appDir, rootDir } = nuxt.options;

    const { resolve } = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.fastNav = options as any;

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
      hooks: {},
    } satisfies AppConfigInput["fastNav"];

    // Nuxt Bug Patch
    if (__dirname.endsWith("src")) {
      nuxt.hook("prepare:types", ({ references }) => {
        references.push({
          types: getModulePath(rootDir),
        });
      });
    }

    addTypeTemplate({
      src: resolve("./runtime/templates/types.d.ts"),
      filename: "types/ucstu/nuxt-fast-nav.d.ts",
      options: {
        self: getModuleName(__dirname.endsWith("src"), rootDir),
        page: resolve(appDir, "../pages/runtime/composables"),
      },
    });

    addTemplate({
      write: true,
      filename: "types/ucstu/nuxt-fast-nav/config.ts",
      getContents() {
        return `export interface FsNavConfig ${JSON.stringify(
          options,
          null,
          2,
        )};`;
      },
    });

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
          "never",
        );
        return `export interface FsNavMenuKey ${
          _interface === "never" ? "{}" : _interface
        };`;
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

function getModuleName(isDev: boolean, rootDir: string) {
  return !isDev
    ? `${name}/module`
    : rootDir.endsWith("playground")
      ? "../../../../src/module"
      : "../../../src/module";
}

function getModulePath(rootDir: string) {
  return rootDir.endsWith("playground") ? "../../dist/types" : "../dist/types";
}
