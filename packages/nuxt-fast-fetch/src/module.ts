import { createClient, type UserConfig } from "@hey-api/openapi-ts";
import { extendServerRpc, onDevToolsInitialized } from "@nuxt/devtools-kit";
import {
  addImports,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
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
    installModule("@ucstu/nuxt-fast-utils");

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

    function fillConfig(
      name: string,
      config: Pick<
        UserConfig,
        "input" | "schemas" | "services" | "types" | "client"
      > = options.clients[name],
    ) {
      const input =
        typeof config.input === "object"
          ? config.input
          : isFileSystemPath(config.input)
            ? resolve(nuxt.options.rootDir, config.input)
            : config.input;
      const output = resolve(nuxt.options.buildDir, "fast-fetch", name);

      return {
        ...config,
        input,
        output,
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
                if (typeof input === "object" || isFileSystemPath(input))
                  return;
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
              console.error(e);
            }
          },
        });
      });
    }

    for (const [name, value] of Object.entries(options.clients)) {
      const config = fillConfig(name, value);
      const { output } = config;
      nuxt.options.alias[`#fast-fetch/${name}`] = output;
      addImports({
        name: "*",
        as: `$${camelCase(name)}`,
        from: resolve(output, "index.ts"),
      });
      try {
        await createClient(config);
      } catch (e) {
        console.error(e);
      }
    }
  },
});
