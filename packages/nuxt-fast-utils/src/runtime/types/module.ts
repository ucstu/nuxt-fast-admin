import type { RequiredDeep } from "type-fest";

export interface ModuleOptions {}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastUtils: ModuleOptionsDefaults & {
    /**
     * 服务端渲染
     */
    ssr: boolean;
  };
}
