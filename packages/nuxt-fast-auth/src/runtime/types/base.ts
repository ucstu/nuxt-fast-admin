import type { RouteLocationRaw } from "#vue-router";
import type { LiteralUnion } from "@ucstu/nuxt-fast-utils/types";

export interface FsAuthOptions {}

/**
 * 鉴权权限
 */
export type FsAuthPer = string | number | bigint | boolean;

/**
 * 鉴权元数据
 * - `string` 权限
 * - `number` 权限
 * - `bigint` 权限
 * - `boolean` 权限
 * - `FsAuthMeta[]` 包含所有
 * - `["|", ...FsAuthMeta[]]` 包含任一
 * - `["!", FsAuthMeta]` 不包含
 * @param D 递归深度 (默认为 10)
 * @param A 递归数组 (默认为 [])
 * @description
 * - 注意："|" 和 "!" 有特殊含义，不可作为权限名称
 * - 如不得已，可添加转义字符，如 "\|" 和 "\!"
 * @example
 * ```ts
 * // 权限
 * "admin"
 * // 包含所有
 * ["admin", "user"]
 * // 包含任一
 * ["|", "admin", "user"]
 * // 不包含
 * ["!", "admin", "user"]
 * ```
 */
export type FsAuthMeta<
  D extends number = 10,
  A extends number[] = [],
> = A["length"] extends D
  ? never
  :
      | FsAuthPer
      | FsAuthMeta<D, [0, ...A]>[]
      | [LiteralUnion<"!" | "|", FsAuthPer>, ...FsAuthMeta<D, [0, ...A]>[]];

/**
 * 页面鉴权元数据
 */
export interface FsAuthPage {
  /**
   * 需要的角色
   * @default false
   */
  role?: FsAuthMeta;
  /**
   * 需要的权限
   * @default false
   */
  per?: FsAuthMeta;
  /**
   * 角色权限混合逻辑
   * @default "|"
   */
  mix?: "|" | "&";
  /**
   * 重定向配置
   */
  redirect?: {
    /**
     * 未认证重定向
     * @description 未认证重定向
     * @default true
     */
    unAuth?: boolean | RouteLocationRaw;
    /**
     * 鉴权通过重定向
     * @description 鉴权通过重定向
     * @default false
     */
    passed?: boolean | RouteLocationRaw;
    /**
     * 鉴权失败重定向
     * @description 鉴权失败重定向
     * @default true
     */
    failed?: boolean | RouteLocationRaw;
  };
}

/**
 * 认证表单
 */
export interface FsAuthForm {
  username?: string;
  password?: string;
  [key: string]: any;
}

/**
 * 认证用户
 */
export interface FsAuthUser {
  [key: string]: any;
}
