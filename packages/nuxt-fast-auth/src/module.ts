import {
  addImportsSources,
  addPlugin,
  addRouteMiddleware,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import type { AppConfigInput } from "@nuxt/schema";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { camelCase } from "lodash-es";
import { name, version } from "../package.json";
import type {
  FsAuthConfig,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

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
    installModule("@ucstu/nuxt-fast-utils");

    const options = _options as ModuleOptionsDefaults;

    const { resolve } = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.fastAuth = options;

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
    } satisfies AppConfigInput["fastAuth"];

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      __dirname,
      getContents(data) {
        return `import type { FsAuthMeta, FsAuthPage } from "<%= options.self %>";
declare module "<%= options.page %>" {
  interface PageMeta {
    /**
     * 页面鉴权配置
     */
    auth?: FsAuthPage | FsAuthMeta;
  }
}`;
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
      imports: ["isFsAuthPage", "isFsAuthMeta"],
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

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    fastAuth?: FsAuthConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    fastAuth?: FsAuthConfig;
  }
}
