import type { RouteLocationRaw } from "#vue-router";
import type { RequiredDeep, UnknownRecord } from "@ucstu/nuxt-fast-utils/types";
import type { FsAuthMeta, FsAuthPage } from "./base";

export interface FsAuthConfig {
  /**
   * 认证提供者配置
   */
  provider?: UnknownRecord & {
    /**
     * 默认令牌有效时间
     * @description 令牌有效时间，单位为毫秒
     * @default 256 * 24 * 60 * 60 * 1000
     */
    tokenExpires?: number;
    /**
     * 刷新令牌有效时间
     * @description 刷新令牌有效时间，单位为毫秒
     * @default 256 * 24 * 60 * 60 * 1000
     */
    refreshTokenExpires?: number;
    /**
     * 页面聚焦时刷新令牌
     * @description 当窗口重新获得焦点时刷新令牌
     * @default true
     */
    refreshOnWindowFocus?: boolean;
  };
  /**
   * 会话（用户信息）配置
   * @description 会话配置
   */
  session?: UnknownRecord & {
    /**
     * 定时刷新会话的时间间隔，单位为毫秒
     * - `0` 表示禁用定时刷新
     * - `number` 表示启用定时刷新，且指定时间间隔
     * @default 0
     */
    refreshPeriodically?: number;
    /**
     * 当窗口获得焦点时刷新会话
     * @default false
     */
    refreshOnWindowFocus?: boolean;
  };
  /**
   * 页面配置
   * @description 页面配置
   */
  page?: UnknownRecord & {
    /**
     * 默认页面鉴权元数据
     * @default
     * ```json
     * {
     *  "role": false,
     *  "per": false,
     *  "mix": "|",
     *  "redirect": {
     *   "unAuth": true,
     *   "passed": false,
     *   "failed": true
     *  }
     * }
     * ```
     */
    auth?: FsAuthPage | FsAuthMeta;
  };
  /**
   * 首页路径
   * @description 登录成功后重定向的路径
   * @default "/"
   */
  home?: RouteLocationRaw;
  /**
   * 认证页路径
   * @default "/auth"
   */
  signIn?: RouteLocationRaw;
  /**
   * 退出登录页路径
   * @default "/auth"
   */
  signOut?: RouteLocationRaw;
}

export type FsAuthConfigDefaults = RequiredDeep<FsAuthConfig>;
