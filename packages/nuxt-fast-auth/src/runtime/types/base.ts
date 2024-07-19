import type { RouteLocationRaw } from "#vue-router";
import type {
  LiteralUnion,
  OverrideProperties,
  RequiredDeep,
} from "@ucstu/nuxt-fast-utils/exports";

export interface FastAuthOptions {}

export interface FastAuthExtra {
  to?: RouteLocationRaw;
}

/**
 * 鉴权令牌
 */
export interface FastAuthToken {
  /**
   * 值
   */
  value?: string;
  /**
   * 创建时间
   */
  create?: number;
  /**
   * 过期时间
   */
  expires?: number;
}

/**
 * 鉴权权限
 */
export type FastAuthPer = string | number | bigint | boolean;

/**
 *  鉴权权限包装器
 */
export interface FastAuthPerWrapper {
  type: "per" | "role";
  value: Exclude<FastAuthPer, boolean>;
}

/**
 * 鉴权元数据（基础）
 * - `FastAuthPer` 权限
 * - `FastAuthPerWrapper` 权限包装器
 * - `FsAuthMeta[]` 包含所有
 * - `["|", ...FsAuthMeta[]]` 包含任一
 * - `["!", ...FsAuthMeta[]]` 不包含
 * @param D 递归深度 (默认为 10)
 * @param A 递归数组 (默认为 [])
 * @description
 * - 注意："|" 和 "!" 有特殊含义，不可作为权限名称
 * @example
 * ```ts
 * // 权限
 * "admin"
 * // 包含所有
 * ["admin", "user"]
 * // 包含所有(包装器)
 * [role("admin"), "user"]
 * // 包含任一
 * ["|", "admin", "user"]
 * // 不包含
 * ["!", "admin", "user"]
 * ```
 */
export type FastAuthBase<
  D extends number = 10,
  A extends number[] = [],
> = A["length"] extends D
  ? never
  :
      | FastAuthPer
      | FastAuthPerWrapper
      | FastAuthBase<D, [0, ...A]>[]
      | [
          LiteralUnion<"!" | "|", FastAuthPer> | FastAuthPerWrapper,
          ...FastAuthBase<D, [0, ...A]>[],
        ];

/**
 * 鉴权元数据
 */
export interface FastAuthMeta {
  /**
   * 需要的权限
   * @default false
   */
  auth?: FastAuthBase;
  /**
   * 重定向配置
   */
  redirect?: {
    /**
     * 未登录重定向
     * @description 未登录重定向
     * @default true
     */
    anonymous?: boolean | RouteLocationRaw;
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
export interface FastAuthForm {
  username?: string;
  password?: string;
  [key: string]: any;
}

/**
 * 认证用户
 */
export interface FastAuthUser {
  [key: string]: any;
}

/**
 * 鉴权页面
 */
export interface FastAuthPage extends Required<FastAuthExtra> {
  auth?: FastAuthMeta | FastAuthBase;
}

/**
 * 鉴权页面（已填充）
 */
export type FastAuthPageFilled = RequiredDeep<
  Omit<
    OverrideProperties<
      FastAuthPage,
      {
        auth?: FastAuthMeta;
      }
    >,
    keyof FastAuthExtra
  >
> &
  Required<FastAuthExtra>;
