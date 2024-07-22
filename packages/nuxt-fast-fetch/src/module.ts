import { createClient, type UserConfig } from "@hey-api/openapi-ts";
import { extendServerRpc, onDevToolsInitialized } from "@nuxt/devtools-kit";
import {
  addImports,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { genExport } from "knitwork";
import { camelCase } from "lodash-es";
import { setupDevToolsUI } from "./devtools";
import {
  configKey,
  defaults,
  initModule,
  name,
  version,
} from "./runtime/config";
import type { ModuleOptions } from "./runtime/types";
import { isFileSystemPath } from "./runtime/utils";

export type {
  ModuleOptions,
  ModulePublicRuntimeConfig,
  ModuleRuntimeHooks,
} from "./runtime/types/module";

interface Document {
  name: string;
  url: string;
}
interface ClientFunctions {}

interface ServerFunctions {
  getDocuments(): Array<Document>;
  refreshDocument(name: string): void;
}

const RPC_NAMESPACE = "fast-fetch-rpc";

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

    const resolver = createResolver(import.meta.url);
    const { resolve } = resolver;

    if (nuxt.options.dev) {
      const optimizeDeps = ["@hey-api/client-fetch", "@hey-api/client-axios"];
      extendViteConfig((config) => {
        config.optimizeDeps ||= {};
        config.optimizeDeps.include ||= [];
        for (const item of optimizeDeps) {
          if (!config.optimizeDeps.include.includes(item)) {
            config.optimizeDeps.include.push(`${name} > ${item}`);
          }
        }
      });
    }
    const transpile = ["@hey-api/client-fetch", "@hey-api/client-axios"];
    for (const item of transpile) {
      if (!nuxt.options.build.transpile.includes(item)) {
        nuxt.options.build.transpile.push(item);
      }
    }

    function fillConfig(
      name: string,
      config: Pick<
        UserConfig,
        "input" | "schemas" | "services" | "types" | "client"
      > = options.clients[name],
    ) {
      const input =
        config.input instanceof Object
          ? config.input
          : isFileSystemPath(config.input)
            ? resolve(nuxt.options.rootDir, config.input)
            : config.input;
      const output = resolve(nuxt.options.buildDir, "fast-fetch", name);

      return {
        ...config,
        input,
        output,
        client: config.client
          ? {
              bundle: true,
              name:
                typeof config.client === "string"
                  ? config.client
                  : config.client.name,
            }
          : undefined,
      };
    }

    if (nuxt.options.devtools) {
      setupDevToolsUI(nuxt, resolver);
      onDevToolsInitialized(async () => {
        extendServerRpc<ClientFunctions, ServerFunctions>(RPC_NAMESPACE, {
          getDocuments() {
            return Object.entries(options.clients)
              .map(([name, value]) => {
                const { input } = fillConfig(name, value);
                if (input instanceof Object || isFileSystemPath(input)) return;
                return {
                  name: name,
                  url: input,
                };
              })
              .filter((item) => item !== undefined);
          },
          async refreshDocument(name) {
            const config = fillConfig(name);
            try {
              await createClient(config);
            } catch (e) {
              console.error(`Failed to refresh document ${name}`, e);
            }
          },
        });
      });
    }

    addPlugin({
      name,
      src: resolve("./runtime/plugins/plugin"),
    });

    for (const [name, value] of Object.entries(options.clients)) {
      const config = fillConfig(name, value);
      const { output } = config;
      nuxt.options.alias[`#fast-fetch/${name}`] = output;
      addImports({
        name: "*",
        as: `$${camelCase(name)}`,
        from: output,
      });
      try {
        await createClient(config);
      } catch (e) {
        console.error(`Failed to create client ${name}`, e);
      }
    }

    nuxt.options.alias["#fast-fetch"] = resolve(
      nuxt.options.buildDir,
      "fast-fetch",
    );
    addTemplate({
      filename: resolve(nuxt.options.buildDir, "fast-fetch/index.ts"),
      getContents() {
        return Object.keys(options.clients)
          .map(
            (name) =>
              `// @ts-ignore\n${genExport("./" + name, {
                name: "*",
                as: `$${camelCase(name)}`,
              })}`,
          )
          .join("\n");
      },
      write: true,
    });
  },
});
