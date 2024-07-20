import { addTemplate, addTypeTemplate } from "@nuxt/kit";
import { genAugmentation, genTypeImport } from "knitwork";
import { upperFirst } from "lodash-es";

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

  const isDev = __dirname_.replace(process.cwd(), "").startsWith("/src");
  const moduleName = !isDev
    ? `${name}/types`
    : nuxt.options.rootDir.endsWith("playground")
      ? "../../../../src/runtime/types"
      : "../../../src/runtime/types";
  if (isDev) {
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
    getContents({ nuxt, app }) {
      return `${genTypeImport(`./${fileName}/options`, [`_${optionsName}`])}
${genAugmentation(moduleName, {
  [optionsName]: [{}, { extends: `_${optionsName}` }],
})}

${
  getContents?.({
    nuxt,
    app,
    options: {
      fileName,
      optionsName,
      moduleName,
    },
  }) ?? ""
}`;
    },
  });
}
