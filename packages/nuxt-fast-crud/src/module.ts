import {
  addComponent,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { camelCase, upperFirst } from "lodash-es";
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

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      configKey,
      __dirname,
    });

    const { resolve } = createResolver(import.meta.url);

    if (nuxt.options.dev) {
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
            config.optimizeDeps.include.push(`${name} > ${item}`);
          }
        }
      });
      const transpile = [
        "@fast-crud/fast-crud",
        "@fast-crud/fast-extends",
        "@fast-crud/ui-interface",
        `@fast-crud/ui-${options.framework}`,
      ];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    } else {
      const transpile = [
        "@fast-crud/fast-crud",
        "@fast-crud/fast-extends",
        "@fast-crud/ui-interface",
        `@fast-crud/ui-${options.framework}`,
      ];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    }

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
      "FsTableColumnsFixedController",
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
        mode: clientOnlyComponents.includes(upperFirst(camelCase(name)))
          ? "client"
          : "all",
      });
    });

    addComponent({
      name: "FcCrud",
      mode: "client",
      filePath: resolve("./runtime/components/crud.vue"),
    });

    const composables = [
      "useUi",
      "asyncCompute",
      "buildTableColumnsFlatMap",
      "compute",
      "dict",
      "exportTable",
      "forEachColumns",
      "forEachTableColumns",
      "getCrudOptionsPlugin",
      "importTable",
      "loadFsExportUtil",
      "loadFsImportUtil",
      "registerCrudOptionsPlugin",
      "registerMergeColumnPlugin",
      "setLogger",
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
      "useI18n",
      "useMerge",
      "useTypes",
      "buildBinding",
      "creator",
      "doRenderComponent",
      "renderComponent",
      "useUiRender",
    ];

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: composables,
    });

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: ["defineCrudOptions"],
    });
  },
});
