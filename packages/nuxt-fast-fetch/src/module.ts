import { createClient } from "@hey-api/openapi-ts";
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

export type * from "./runtime/types/module";

interface Document {
  name: string;
  url: string;
}
interface ClientFunctions {
  reloadDocument(): void;
}

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

    for (const [key, vlue] of Object.entries(options.clients)) {
      const output = resolve(nuxt.options.buildDir, "fast-fetch", key);
      nuxt.options.alias[`#fast-fetch/${key}`] = output;
      await createClient({ ...vlue, output });
      addImports({
        name: "*",
        as: `$${camelCase(key)}`,
        from: resolve(output, "index.ts"),
      });
    }

    if (nuxt.options.devtools) {
      setupDevToolsUI(nuxt, resolver);
      onDevToolsInitialized(async () => {
        const rpc = extendServerRpc<ClientFunctions, ServerFunctions>(
          RPC_NAMESPACE,
          {
            getDocuments() {
              return Object.entries(options.clients).map(([key, value]) => ({
                name: key,
                url: value.input as string,
              }));
            },
            async refreshDocument(name) {
              const output = resolve(nuxt.options.buildDir, "fast-fetch", name);
              await createClient({ ...options.clients[name], output });
              await rpc.broadcast.reloadDocument();
            },
          }
        );
      });
    }
  },
});
