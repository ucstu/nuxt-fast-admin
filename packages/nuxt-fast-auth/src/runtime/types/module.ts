import type { RequiredDeep } from "@ucstu/nuxt-fast-utils/types";

interface LocalProvider {
  /**
   * 认证提供者
   * @description 本地认证提供者
   * @default "local"
   */
  type: "local";
}

interface RefreshProvider {
  /**
   * 认证提供者
   * @description 刷新令牌认证提供者
   */
  type: "refresh";
}

export interface ModuleOptions {
  /**
   * 认证提供者配置
   */
  provider?: LocalProvider | RefreshProvider;
}

export type ModuleOptionsDefaults = RequiredDeep<ModuleOptions>;

export interface ModulePublicRuntimeConfig {
  fastAuth: ModuleOptionsDefaults;
}
