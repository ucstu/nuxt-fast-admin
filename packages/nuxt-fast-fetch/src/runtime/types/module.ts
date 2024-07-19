import type { Options } from "@hey-api/client-fetch";
import type { UserConfig } from "@hey-api/openapi-ts";

export interface ModuleOptions {
  clients?: {
    [key: string]: Pick<
      UserConfig,
      "input" | "schemas" | "services" | "types" | "client"
    > & {
      /**
       * The base URL of the client.
       */
      baseUrl?: string;
    };
  };
}

export type ModuleOptionsDefaults = Required<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastFetch: ModuleOptionsDefaults;
}

interface LegacyRequestOptions {
  type: "legacy";
  request: RequestInit;
}

interface ClientRequestOptions {
  type: "client";
  request: Request;
  options: Options;
}

interface LegacyResponseOptions {
  type: "legacy";
  response: Response;
}

interface ClientResponseOptions {
  type: "client";
  request: Request;
  response: Response;
  options: Options;
}

export interface ModuleRuntimeHooks {
  "fast-fetch:request": (
    name: string,
    options: LegacyRequestOptions | ClientRequestOptions
  ) => void;
  "fast-fetch:response": (
    name: string,
    options: LegacyResponseOptions | ClientResponseOptions
  ) => void;
}
