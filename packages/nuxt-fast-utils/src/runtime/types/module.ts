import type { RouteLocationRaw } from "#vue-router";
import type { RequiredDeep } from "type-fest";
import type { ShallowRef } from "vue-demi";

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

export interface ModuleRuntimeHooks {
  /**
   * 路径是否相等
   * @param a RouteLocationRaw
   * @param b RouteLocationRaw
   * @param result 结果
   */
  "fast-utils:to-equal": (
    a: RouteLocationRaw | undefined,
    b: RouteLocationRaw | undefined,
    result: ShallowRef<boolean | undefined>,
  ) => void;
}
