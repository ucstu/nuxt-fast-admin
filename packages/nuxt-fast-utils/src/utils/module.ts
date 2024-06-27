import { addTemplate, addTypeTemplate } from "@nuxt/kit";
import type { Nuxt, NuxtApp } from "@nuxt/schema";
import { camelCase, template, upperFirst } from "lodash-es";

const getModuleOptions =
  template(`import type { _<%= options.optionsName %> } from "./<%= options.fileName %>/options";
declare module "<%= options.moduleName %>" {
  interface <%= options.optionsName %> extends _<%= options.optionsName %> {}
}

<%= options.contents %>
`);

interface AddModuleTypeTemplateOptions {
  /**
   * 模块名称
   */
  name: string;
  /**
   * 模块选项
   */
  options: any;
  /**
   * 文件夹名称
   */
  __dirname: string;
  /**
   * 扩展内容
   */
  getContents?: (data: {
    nuxt: Nuxt;
    app: NuxtApp;
    options: {
      fileName: string;
      moduleName: string;
      optionsName: string;
    };
  }) => string | Promise<string>;
}
/**
 * 添加模块类型模板
 * @param options
 */
export function addModuleTypeTemplate(options: AddModuleTypeTemplateOptions) {
  const { name, options: _options, __dirname: __dirname_, getContents } = options;
  const filePath = name.replace(/^@/, "");
  const fileName = filePath.split("/").pop() ?? filePath;
  const optionsName = `${upperFirst(
    camelCase(name.replace(/^@ucstu\/nuxt-/, "").replace("fast", "fs"))
  )}Options`;

  addTemplate({
    write: true,
    filename: `types/${filePath}/options.ts`,
    getContents() {
      return `export interface _${optionsName} ${JSON.stringify(
        _options,
        null,
        2
      )};`;
    },
  });

  addTypeTemplate({
    filename: `types/${filePath}.d.ts`,
    getContents({ nuxt, app, options }) {
      const moduleName = getModuleName(
        name,
        __dirname_.endsWith("src"),
        nuxt.options.rootDir
      );
      const contents = getContents?.({
        nuxt,
        app,
        options: {
          ...options,
          moduleName,
        },
      });
      return getModuleOptions({
        options: {
          ...options,
          moduleName,
          contents,
        },
      });
    },
    options: {
      fileName,
      optionsName,
    },
  });
}

function getModuleName(name: string, isDev: boolean, rootDir: string) {
  return !isDev
    ? `${name}/module`
    : rootDir.endsWith("playground")
    ? "../../../../src/module"
    : "../../../src/module";
}
