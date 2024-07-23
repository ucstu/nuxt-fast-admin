import type { Options } from "@hey-api/client-fetch";
import type { UserConfig } from "@hey-api/openapi-ts";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

type Client =
  | "@hey-api/client-axios"
  | "@hey-api/client-fetch"
  | "angular"
  | "axios"
  | "fetch"
  | "node"
  | "xhr";

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
      /**
       * The type of client to use.
       */
      client?: Client;
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

interface ClientFetchRequestOptions {
  type: "client-fetch";
  request: Request;
  options: Options;
}

interface ClientAxiosRequestOptions {
  type: "client-axios";
  request: InternalAxiosRequestConfig<any>;
}

interface ClientAxiosRequestErrorOptions {
  type: "client-axios";
  error: any;
}

interface LegacyResponseOptions {
  type: "legacy";
  response: Response;
}

interface ClientFetchResponseOptions {
  type: "client-fetch";
  request: Request;
  response: Response;
  options: Options;
}

interface ClientAxiosResponseOptions {
  type: "client-axios";
  response: AxiosResponse<any, any>;
}

interface ClientAxiosResponseErrorOptions {
  type: "client-axios";
  error: any;
}

export interface ModuleRuntimeHooks {
  "fast-fetch:request": (
    name: string,
    options:
      | LegacyRequestOptions
      | ClientFetchRequestOptions
      | ClientAxiosRequestOptions
      | ClientAxiosRequestErrorOptions,
  ) => void;
  "fast-fetch:response": (
    name: string,
    options:
      | LegacyResponseOptions
      | ClientFetchResponseOptions
      | ClientAxiosResponseOptions
      | ClientAxiosResponseErrorOptions,
  ) => void;
}
