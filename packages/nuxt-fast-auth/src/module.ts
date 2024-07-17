import {
  addImportsSources,
  addPlugin,
  addRouteMiddleware,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { camelCase } from "lodash-es";
import {
  configKey,
  defaults,
  initModule,
  name,
  version,
} from "./runtime/config";
import type { ModuleOptions } from "./runtime/types";

export type {
  ModuleOptions,
  ModulePublicRuntimeConfig,
  ModuleRuntimeHooks,
} from "./runtime/types/module";

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
      getContents({ options: { moduleName } }) {
        return `import type { FastAuthPage } from "${moduleName}";
declare module "${resolve(
          nuxt.options.appDir,
          "../pages/runtime/composables",
        )}" {
  interface PageMeta extends Omit<FastAuthPage, "to"> {}
}`;
      },
    });

    const { resolve } = createResolver(import.meta.url);

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
      imports: ["isAuthMeta", "isAuthBase", "getAuthPageFilled", "authPage"],
    });

    addRouteMiddleware({
      path: resolve(`./runtime/middleware/auth.global`),
      name: "auth",
      global: true,
    });
  },
});
