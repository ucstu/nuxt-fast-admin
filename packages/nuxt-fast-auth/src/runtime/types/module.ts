import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/exports";
import type { ShallowRef } from "vue-demi";
import type { FastAuthPage, FastAuthPageFilled } from "./base";
import type { AuthHooks, PageHooks } from "./hooks";

export interface ModuleOptions {
  /**
   * 认证提供者
   * @default "local"
   */
  provider?: "local" | "refresh";
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastAuth: ModuleOptionsDefaults;
}

export interface ModuleRuntimeHooks extends AuthHooks, PageHooks {
  /**
   * 获取页面信息
   * @param origin 原始
   * @param result 结果
   */
  "fast-auth:get-page": (
    origin: FastAuthPage | FastAuthPageFilled,
    result: ShallowRef<FastAuthPageFilled>,
  ) => void;
}
