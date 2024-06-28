import { getFuConfig, refAppConfig, type MaybeRefOrGetter } from "#imports";
import { computedEager, toRef } from "@ucstu/nuxt-fast-utils/exports";
import type { LiteralUnion } from "@ucstu/nuxt-fast-utils/types";
import type { FsAuthMeta, FsAuthPer } from "../types";
import { useUser } from "./use-auth";

/**
 * 原始鉴权
 * @param has 已有权限
 * @param needs 需要的权限
 * @returns 是否有权限
 */
function _auth(has: FsAuthPer[], needs: FsAuthMeta): boolean {
  if (typeof needs === "boolean") {
    return needs === false ? true : has.includes(true);
  }
  if (typeof needs === "number" || typeof needs === "bigint") {
    return has.includes(needs);
  }
  if (typeof needs === "string") {
    return has.includes(needs === "\\|" ? "|" : needs === "\\!" ? "!" : needs);
  }
  if (Array.isArray(needs)) {
    switch (needs[0]) {
      case "|":
        return needs.slice(1).some((permission) => _auth(has, permission));
      case "!":
        return !needs.slice(1).some((permission) => _auth(has, permission));
      default:
        return needs.every((permission) => _auth(has, permission));
    }
  }
  return false;
}

/**
 * 鉴权 (响应式)
 * @param needs 需要的权限
 * @returns 是否拥有权限
 * @example $auth("admin") // 是否拥有 admin 权限
 * @example $auth("admin", "user") // 是否拥有 admin 和 user 权限
 * @example $auth("|", "user", "admin") // 是否拥有 user 或 admin 权限
 * @example $auth("!", "user", "admin") // 是否没有 user 和 admin 权限
 * @example $auth("|", ["user", "admin"], "all") // 是否 (同时拥有 user 和 admin 权限) 或 具有 all 权限
 */
export function auth(
  ...needs:
    | MaybeRefOrGetter<FsAuthMeta>[]
    | [
        MaybeRefOrGetter<LiteralUnion<"!" | "|", FsAuthPer>>,
        ...MaybeRefOrGetter<FsAuthMeta>[]
      ]
) {
  const user = useUser();
  const config = refAppConfig("fastAuth");
  const hasRef = computedEager(() => [
    !!user.value,
    ...(config.value!.authHooks!.getPermissions?.(user.value) ?? []),
  ]);
  const needsRef = computedEager(() => needs.map((need) => toRef(need).value));
  return computedEager(() => _auth(hasRef.value, needsRef.value as FsAuthMeta));
}

/**
 * 鉴权
 * @param needs 需要的权限
 * @returns 是否拥有权限
 * @example $auth("admin") // 是否拥有 admin 权限
 * @example $auth("admin", "user") // 是否拥有 admin 和 user 权限
 * @example $auth("|", "user", "admin") // 是否拥有 user 或 admin 权限
 * @example $auth("!", "user", "admin") // 是否没有 user 和 admin 权限
 * @example $auth("|", ["user", "admin"], "all") // 是否 (同时拥有 user 和 admin 权限) 或 具有 all 权限
 */
export function authDirect(
  ...needs:
    | FsAuthMeta[]
    | [LiteralUnion<"!" | "|", FsAuthPer> | FsAuthMeta, ...FsAuthMeta[]]
): boolean {
  const user = useUser();
  const config = getAppConfig("fastAuth");
  const has = [
    Boolean(user.value),
    ...(config.authHooks!.getPermissions?.(user.value) ?? []),
  ];
  return _auth(has, needs as FsAuthMeta);
}
