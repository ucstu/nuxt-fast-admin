import type { RequiredDeep } from "type-fest";
import type { configKey } from "../../config";

export interface ModuleOptions {}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  [configKey]: ModuleOptionsDefaults & {
    /**
     * 服务端渲染
     */
    ssr: boolean;
  };
}
