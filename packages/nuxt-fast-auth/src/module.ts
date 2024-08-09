import {
  addImportsSources,
  addPlugin,
  addRouteMiddleware,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { genAugmentation, genTypeImport } from "knitwork";
import { camelCase } from "lodash-es";
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

    if (nuxt.options.dev) {
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
    } else {
      const transpile = ["minimatch"];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    }

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
        return `${genTypeImport(moduleName, ["FastAuthPage"])}
${genAugmentation(pageModule, {
  PageMeta: [
    {},
    {
      extends: 'Omit<FastAuthPage, "to">',
    },
  ],
})}`;
      },
    });

    addPlugin({
      name: `${name}:config`,
      src: resolve(`./runtime/plugins/config`),
    });

    addPlugin({
      name,
      src: resolve(`./runtime/plugins/plugin`),
    });

    addImportsSources({
      from: resolve(`./runtime/composables`),
      imports: [
        {
          name: camelCase(`use-${options.provider}-auth`),
          as: "useAuth",
        },
        "$auth",
        "auth",
        "role",
        "per",
      ],
    });

    addImportsSources({
      from: resolve(`./runtime/utils`),
      imports: ["isAuthMeta", "isAuthBase"],
    });

    addRouteMiddleware({
      path: resolve(`./runtime/middleware/auth.global`),
      name: "auth",
      global: true,
    });
  },
});
