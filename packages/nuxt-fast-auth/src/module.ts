import {
  addImportsSources,
  addPlugin,
  addRouteMiddleware,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
} from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import { camelCase } from "lodash-es";
import { name, version } from "../package.json";
import type { ModuleOptions, ModuleOptionsDefaults } from "./runtime/types";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "fastAuth",
  },
  defaults: {
    provider: {
      type: "local",
    },
  } satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    const options = _options as ModuleOptionsDefaults;
    const { ssr, appDir, rootDir } = nuxt.options;

    const { resolve } = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.fastAuth = {
      ...options,
      ssr,
    };

    nuxt.options.appConfig.fastAuth = {
      provider: {
        tokenExpires: 365 * 24 * 60 * 60 * 1000,
      },
      session: {
        refreshPeriodically: 0,
        refreshOnWindowFocus: false,
      },
      pages: {
        home: "/",
        signIn: "/auth",
        signOut: "/auth",
        authMeta: {
          auth: false,
          redirect: {
            unAuth: true,
            passed: false,
            failed: true,
          },
        },
      },
      authHooks: {},
      pageHooks: {},
    } satisfies AppConfigInput["fastAuth"];

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
      filename: "types/ucstu/nuxt-fast-auth.d.ts",
      options: {
        self: getModuleName(__dirname.endsWith("src"), rootDir),
        page: resolve(appDir, "../pages/runtime/composables"),
        provider:
          __dirname.endsWith("dist") || rootDir.endsWith("playground")
            ? options.provider.type
            : "unknown",
      },
    });

    addTemplate({
      write: true,
      filename: "types/ucstu/nuxt-fast-auth/config.ts",
      getContents() {
        return `export interface FsAuthConfig ${JSON.stringify(
          options,
          null,
          2,
        )};`;
      },
    });

    addPlugin({
      name,
      src: resolve(`./runtime/plugins/plugin`),
    });

    addImportsSources({
      from: resolve(`./runtime/composables`),
      imports: [
        {
          name: camelCase(`use-${options.provider.type}-auth`),
          as: "useAuth",
        },
        "auth",
        "authDirect",
      ],
    });

    addImportsSources({
      from: resolve(`./runtime/utils`),
      imports: ["isFsAuthPage"],
    });

    addRouteMiddleware({
      path: resolve(`./runtime/middleware/auth.global`),
      name: "auth",
      global: true,
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
