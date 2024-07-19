import type { RouteLocationRaw } from "#vue-router";
import type { LiteralUnion, RequiredDeep } from "type-fest";

export interface ModuleConfig {
  /**
   * 历史比较字段
   * @description 用于判断历史记录是否相等
   * @default ["path"]
   */
  keys?: Array<LiteralUnion<keyof RouteLocationRaw, string>>;
}

export type ModuleConfigDefaults = RequiredDeep<ModuleConfig>;
