import { addTemplate, addTypeTemplate } from "@nuxt/kit";
import { template, upperFirst } from "lodash-es";
const getModuleOptions =
  template(`import type { _<%= options.optionsName %> } from "./<%= options.fileName %>/options";
declare module "<%= options.moduleName %>" {
  interface <%= options.optionsName %> extends _<%= options.optionsName %> {}
}

<%= options.contents %>
`);
export function addModuleTypeTemplate(options) {
  const {
    name,
    nuxt,
    configKey,
    options: _options,
    __dirname: __dirname_,
    getContents,
  } = options;
  const filePath = name.replace(/^@/, "");
  const fileName = filePath.split("/").pop() ?? filePath;
  const optionsName = `${upperFirst(configKey)}Options`;
  if (__dirname_.endsWith("src")) {
    nuxt.hook("prepare:types", ({ references }) => {
      references.push({
        path: nuxt.options.rootDir.endsWith("playground")
          ? "../../dist/types.d.ts"
          : "../dist/types.d.ts",
      });
    });
  }
  addTemplate({
    write: true,
    filename: `types/${filePath}/options.ts`,
    getContents() {
      return `export interface _${optionsName} ${JSON.stringify(
        _options,
        null,
        2,
      )};`;
    },
  });
  addTypeTemplate({
    filename: `types/${filePath}.d.ts`,
    getContents({ nuxt: nuxt2, app, options: options2 }) {
      const moduleName = getModuleName(
        name,
        __dirname_.endsWith("src"),
        nuxt2.options.rootDir,
      );
      const contents = getContents?.({
        nuxt: nuxt2,
        app,
        options: {
          ...options2,
          moduleName,
        },
      });
      return getModuleOptions({
        options: {
          ...options2,
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
function getModuleName(name, isDev, rootDir) {
  return !isDev
    ? `${name}/module`
    : rootDir.endsWith("playground")
      ? "../../../../src/module"
      : "../../../src/module";
}
