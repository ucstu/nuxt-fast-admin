import type { UserConfig } from "@hey-api/openapi-ts";

export interface ModuleOptions {
  clients?: {
    [key: string]: Pick<
      UserConfig,
      "input" | "schemas" | "services" | "types" | "client"
    >;
  };
}

export type ModuleOptionsDefaults = Required<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastCrud: ModuleOptionsDefaults;
}
