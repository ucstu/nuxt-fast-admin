import {
  addComponent,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
} from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import { name, version } from "../package.json";
import type { ModuleOptions, ModuleOptionsDefaults } from "./runtime/types";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "fastCrud",
  },
  defaults: {
    framework: "naive",
  } satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    const options = _options as ModuleOptionsDefaults;
    const { rootDir } = nuxt.options;

    const { resolve } = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.fastCrud = options as any;

    nuxt.options.appConfig.fastCrud = {
      fsSetupOptions: {
        logger: {
          off: {
            tableColumns: false,
          },
        },
      },
    } satisfies AppConfigInput["fastCrud"];

    // Nuxt Bug Patch
    if (__dirname.endsWith("src")) {
      nuxt.hook("prepare:types", ({ references }) => {
        references.push({
          types: getModulePath(rootDir),
        });
      });
    }

    if (options.framework === "naive") {
      if (process.env.NODE_ENV === "development") {
        const optimizeDeps = ["naive-ui"];
        extendViteConfig((config) => {
          config.optimizeDeps ||= {};
          config.optimizeDeps.include ||= [];
          for (const item of optimizeDeps) {
            if (!config.optimizeDeps.include.includes(item)) {
              config.optimizeDeps.include.push(item);
            }
          }
        });
        const transpile = ["@juggle/resize-observer"];
        for (const item of transpile) {
          if (!nuxt.options.build.transpile.includes(item)) {
            nuxt.options.build.transpile.push(item);
          }
        }
      } else {
        const transpile = [
          "naive-ui",
          "vueuc",
          "@css-render/vue3-ssr",
          "@juggle/resize-observer",
          "@iconify/vue",
        ];
        for (const item of transpile) {
          if (!nuxt.options.build.transpile.includes(item)) {
            nuxt.options.build.transpile.push(item);
          }
        }
      }
    }

    if (process.env.NODE_ENV === "development") {
      const optimizeDeps = [
        "@fast-crud/fast-crud",
        "@fast-crud/fast-extends",
        "@fast-crud/ui-interface",
        `@fast-crud/ui-${options.framework}`,
      ];
      extendViteConfig((config) => {
        config.optimizeDeps ||= {};
        config.optimizeDeps.include ||= [];
        for (const item of optimizeDeps) {
          if (!config.optimizeDeps.include.includes(item)) {
            config.optimizeDeps.include.push(item);
          }
        }
      });
    }
    nuxt.options.build.transpile.push(
      "@fast-crud/fast-crud",
      "@fast-crud/fast-extends",
      "@fast-crud/ui-interface",
      `@fast-crud/ui-${options.framework}`,
    );

    addPlugin({
      name,
      src: resolve(`./runtime/plugins/${options.framework}`),
    });

    const components = [
      "FsActionbar",
      "FsBox",
      "FsButton",
      "FsCell",
      "FsColumnsFilterLayoutDefault",
      "FsComponentRender",
      "FsContainer",
      "FsCrud",
      "FsDateFormat",
      "FsDictCascader",
      "FsDictCascaderFormat",
      "FsDictCheckbox",
      "FsDictRadio",
      "FsDictSelect",
      "FsDictSwitch",
      "FsDictTree",
      "FsEditable",
      "FsEditableCell",
      "FsForm",
      "FsFormHelper",
      "FsFormItem",
      "FsFormProvider",
      "FsFormWrapper",
      "FsIcon",
      "FsIconSvg",
      "FsIconify",
      "FsLabel",
      "FsLayoutCard",
      "FsLayoutDefault",
      "FsLoading",
      "FsPage",
      "FsRender",
      "FsRowHandle",
      "FsSearch",
      "FsSearchLayoutDefault",
      "FsSearchV1",
      "FsSlotRender",
      "FsTable",
      "FsTableSelect",
      "FsTabsFilter",
      "FsToolbar",
      "FsValuesFormat",
    ];

    const clientOnlyComponents = ["FsCrud"];

    components.forEach((name) => {
      addComponent({
        name,
        export: name,
        filePath: resolve("./runtime/components"),
        mode: clientOnlyComponents.includes(name) ? "client" : "all",
      });
    });

    const composables = [
      "useColumns",
      "useCompute",
      "useCrud",
      "useDict",
      "useDictDefine",
      "useDrag",
      "useExpose",
      "useFormWrapper",
      "useFs",
      "useFsAsync",
      "useTypes",
      "useUi",
      "useUiRender",
    ];

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: composables,
    });
  },
});

function getModulePath(rootDir: string) {
  return rootDir.endsWith("playground") ? "../../dist/types" : "../dist/types";
}
