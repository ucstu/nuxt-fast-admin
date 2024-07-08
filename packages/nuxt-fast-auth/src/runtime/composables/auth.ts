import { computed, ref, useNuxtAppBack, type MaybeRefOrGetter } from "#imports";
import { toRef } from "@ucstu/nuxt-fast-utils/exports";
import type { LiteralUnion } from "@ucstu/nuxt-fast-utils/types";
import { minimatch } from "minimatch";
import type { FsAuthMeta, FsAuthPer, FsAuthUser } from "../types";
import { useUser } from "./use-auth";

/**
 * 是否具有
 * @param has 已有
 * @param needs 需要
 * @returns 是否有
 */
function have(has: FsAuthPer[], needs: FsAuthMeta): boolean {
  if (typeof needs === "boolean") {
    return needs === false ? true : has.includes(true);
  }
  if (typeof needs === "number" || typeof needs === "bigint") {
    return has.includes(needs);
  }
  if (typeof needs === "string") {
    return has.some(
      (item) => typeof item === "string" && minimatch(needs, item)
    );
  }
  if (Array.isArray(needs)) {
    switch (needs[0]) {
      case "|":
        return needs.slice(1).some((permission) => have(has, permission));
      case "!":
        return !needs.slice(1).some((permission) => have(has, permission));
      default:
        return needs.every((permission) => have(has, permission));
    }
  }
  return false;
}

/**
 * 获取用户权限|角色列表
 * @param user 用户信息
 * @param type 类型
 * @param nuxtApp Nuxt 应用
 * @returns 用户权限|角色列表
 */
function get(
  user: FsAuthUser | null | undefined,
  type: "permissions" | "roles" = "permissions",
  nuxtApp = useNuxtAppBack()
) {
  const result = ref<Exclude<FsAuthPer, boolean>[]>([]);
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    `fast-auth:get-${type}`,
    user,
    result
  );
  return result.value;
}

/**
 * 鉴定权限
 * @param needs 需要的权限
 * @returns 是否拥有权限
 * @example per("admin") // 是否拥有 admin 权限
 * @example per("admin", "user") // 是否拥有 admin 和 user 权限
 * @example per("|", "user", "admin") // 是否拥有 user 或 admin 权限
 * @example per("!", "user", "admin") // 是否没有 user 和 admin 权限
 * @example per("|", ["user", "admin"], "all") // 是否 (同时拥有 user 和 admin 权限) 或 具有 all 权限
 */
export function per(
  ...needs:
    | MaybeRefOrGetter<FsAuthMeta>[]
    | [
        MaybeRefOrGetter<LiteralUnion<"!" | "|", FsAuthPer>>,
        ...MaybeRefOrGetter<FsAuthMeta>[]
      ]
) {
  const user = useUser();
  const hasRef = computed(() => [
    !!user.value,
    ...get(user.value, "permissions"),
  ]);
  const needsRef = computed(() => needs.map((need) => toRef(need).value));
  return computed(() => have(hasRef.value, needsRef.value as FsAuthMeta));
}

/**
 * 鉴定权限
 * @param needs 需要的权限
 * @returns 是否拥有权限
 * @example per("admin") // 是否拥有 admin 权限
 * @example per("admin", "user") // 是否拥有 admin 和 user 权限
 * @example per("|", "user", "admin") // 是否拥有 user 或 admin 权限
 * @example per("!", "user", "admin") // 是否没有 user 和 admin 权限
 * @example per("|", ["user", "admin"], "all") // 是否 (同时拥有 user 和 admin 权限) 或 具有 all 权限
 */
export function $per(
  ...needs:
    | FsAuthMeta[]
    | [LiteralUnion<"!" | "|", FsAuthPer> | FsAuthMeta, ...FsAuthMeta[]]
): boolean {
  const user = useUser();
  const has = [Boolean(user.value), ...get(user.value, "permissions")];
  return have(has, needs as FsAuthMeta);
}

/**
 * 鉴定角色
 * @param needs 需要的角色
 * @returns 是否拥有角色
 * @example per("admin") // 是否拥有 admin 角色
 * @example per("admin", "user") // 是否拥有 admin 和 user 角色
 * @example per("|", "user", "admin") // 是否拥有 user 或 admin 角色
 * @example per("!", "user", "admin") // 是否没有 user 和 admin 角色
 * @example per("|", ["user", "admin"], "all") // 是否 (同时拥有 user 和 admin 角色) 或 具有 all 角色
 */
export function role(
  ...needs:
    | MaybeRefOrGetter<FsAuthMeta>[]
    | [
        MaybeRefOrGetter<LiteralUnion<"!" | "|", FsAuthPer>>,
        ...MaybeRefOrGetter<FsAuthMeta>[]
      ]
) {
  const user = useUser();
  const hasRef = computed(() => [!!user.value, ...get(user.value, "roles")]);
  const needsRef = computed(() => needs.map((need) => toRef(need).value));
  return computed(() => have(hasRef.value, needsRef.value as FsAuthMeta));
}

/**
 * 鉴定角色
 * @param needs 需要的角色
 * @returns 是否拥有角色
 * @example per("admin") // 是否拥有 admin 角色
 * @example per("admin", "user") // 是否拥有 admin 和 user 角色
 * @example per("|", "user", "admin") // 是否拥有 user 或 admin 角色
 * @example per("!", "user", "admin") // 是否没有 user 和 admin 角色
 * @example per("|", ["user", "admin"], "all") // 是否 (同时拥有 user 和 admin 角色) 或 具有 all 角色
 */
export function $role(
  ...needs:
    | FsAuthMeta[]
    | [LiteralUnion<"!" | "|", FsAuthPer> | FsAuthMeta, ...FsAuthMeta[]]
): boolean {
  const user = useUser();
  const has = [Boolean(user.value), ...get(user.value, "roles")];
  return have(has, needs as FsAuthMeta);
}
