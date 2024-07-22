import type { Options } from "@hey-api/client-fetch";
import type { UserConfig } from "@hey-api/openapi-ts";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

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

interface FetchRequestOptions {
  type: "fetch";
  request: Request;
  options: Options;
}

interface AxiosRequestOptions {
  type: "axios";
  request: InternalAxiosRequestConfig<any>;
}

interface AxiosRequestErrorOptions {
  type: "axios";
  error: any;
}

interface LegacyResponseOptions {
  type: "legacy";
  response: Response;
}

interface FetchResponseOptions {
  type: "fetch";
  request: Request;
  response: Response;
  options: Options;
}

interface AxiosResponseOptions {
  type: "axios";
  response: AxiosResponse<any, any>;
}

interface AxiosResponseErrorOptions {
  type: "axios";
  error: any;
}

export interface ModuleRuntimeHooks {
  "fast-fetch:request": (
    name: string,
    options:
      | LegacyRequestOptions
      | FetchRequestOptions
      | AxiosRequestOptions
      | AxiosRequestErrorOptions,
  ) => void;
  "fast-fetch:response": (
    name: string,
    options:
      | LegacyResponseOptions
      | FetchResponseOptions
      | AxiosResponseOptions
      | AxiosResponseErrorOptions,
  ) => void;
}
