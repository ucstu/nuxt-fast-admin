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
import { name, version } from "../package.json";
import type {
  FsAuthConfig,
  FsAuthConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./runtime/types";

const configKey = "fastAuth";

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
  },
  defaults: {
    provider: {
      type: "local",
    },
  } satisfies ModuleOptionsDefaults,
  setup(_options, nuxt) {
    installModule("@ucstu/nuxt-fast-utils");
    installModule("@ucstu/nuxt-fast-route");

    const options = _options as ModuleOptionsDefaults;

    const { resolve } = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public[configKey] = options;

    nuxt.options.appConfig[configKey] = {
      provider: {
        tokenExpires: 365 * 24 * 60 * 60 * 1000,
        refreshTokenExpires: 365 * 24 * 60 * 60 * 1000,
        refreshOnWindowFocus: true,
      },
      session: {
        refreshPeriodically: 0,
        refreshOnWindowFocus: false,
      },
      page: {
        auth: {
          redirect: {
            unAuth: true,
            passed: false,
            failed: true,
          },
          role: false,
          per: false,
          mix: "|",
        },
      },
      home: "/",
      signIn: "/auth",
      signOut: "/auth",
    } satisfies FsAuthConfigDefaults;

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      __dirname,
      getContents() {
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
          name: camelCase(`use-${options.provider.type}-auth`),
          as: "useAuth",
        },
        "role",
        "$role",
        "per",
        "$per",
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

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    [configKey]?: FsAuthConfig;
  }
}
