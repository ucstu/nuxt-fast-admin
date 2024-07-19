import type { NuxtApp } from "#app";
import { computed, type MaybeRefOrGetter, toValue, useAuth } from "#imports";
import type { LiteralUnion } from "@ucstu/nuxt-fast-utils/exports";
import { isEqual } from "lodash-es";
import { minimatch } from "minimatch";
import type {
  FastAuthBase,
  FastAuthPage,
  FastAuthPer,
  FastAuthPerWrapper,
} from "../types";
import { getAuthPageFilled, isAuthPage } from "../utils";

/**
 * 是否具有
 * @param has 已有
 * @param needs 需要
 * @returns 是否有
 */
function have(
  has: Array<FastAuthPerWrapper | boolean>,
  needs: FastAuthBase,
): boolean {
  if (typeof needs === "boolean") {
    return needs === false
      ? true
      : has.some((item) => typeof item === "boolean" && item === needs);
  }
  if (typeof needs === "number" || typeof needs === "bigint") {
    return has.some(
      (item) =>
        item instanceof Object &&
        item.type === "per" &&
        (typeof item.value === "number" || typeof item.value === "bigint") &&
        item.value === needs,
    );
  }
  if (typeof needs === "string") {
    return has.some(
      (item) =>
        item instanceof Object &&
        item.type === "per" &&
        typeof item.value === "string" &&
        minimatch(needs, item.value),
    );
  }
  if (needs instanceof Object && !Array.isArray(needs)) {
    return has.some((item) => item instanceof Object && isEqual(item, needs));
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
 * 权限包装
 * @param per
 * @returns 权限包装
 */
export function per(per: Exclude<FastAuthPer, boolean>): FastAuthPerWrapper {
  return {
    type: "per",
    value: per,
  };
}

/**
 * 角色包装
 * @param role 角色
 */
export function role(role: Exclude<FastAuthPer, boolean>): FastAuthPerWrapper {
  return {
    type: "role",
    value: role,
  };
}

/**
 * 鉴定权限
 * @param needs 需要的权限
 * @returns 是否拥有权限
 * @description 适用 minimatch 匹配字符串
 * @example auth("admin") // 是否拥有 admin 权限
 * @example auth("*") // 是否拥有 任意 权限
 * @example auth("admin", "user") // 是否拥有 admin 和 user 权限
 * @example auth(role("admin"), "user") // 是否拥有 admin 角色 和 user 权限
 * @example auth("|", "user", "admin") // 是否拥有 user 或 admin 权限
 * @example auth("!", "user", "admin") // 是否没有 user 和 admin 权限
 * @example auth("|", ["user", "admin"], "all") // 是否 (同时拥有 user 和 admin 权限) 或 具有 all 权限
 * @example auth(page) // 是否可以访问某一页面 FastAuthPage
 */
export function auth(
  ...needs:
    | MaybeRefOrGetter<FastAuthBase | FastAuthPage>[]
    | [
        MaybeRefOrGetter<
          | LiteralUnion<"!" | "|", FastAuthPer>
          | Exclude<FastAuthBase, FastAuthPer>
          | FastAuthPage
          | NuxtApp
        >,
        ...MaybeRefOrGetter<FastAuthBase | FastAuthPage>[],
      ]
) {
  let nuxtApp: NuxtApp | undefined;
  if (needs[0] instanceof Object && "globalName" in needs[0]) {
    nuxtApp = needs.shift() as NuxtApp;
  }
  const { status, roles, permissions } = useAuth(nuxtApp);
  const _has = computed(() => [
    status.value.authed ?? false,
    ...roles.value,
    ...permissions.value,
  ]);
  const _needs = computed(() =>
    (needs as MaybeRefOrGetter<FastAuthBase | FastAuthPage>[]).map((need) => {
      const value = toValue(need);
      return isAuthPage(value) ? getAuthPageFilled(value, nuxtApp).auth : value;
    }),
  );
  return computed(() => have(_has.value, _needs.value as FastAuthBase));
}

/**
 * 鉴定权限
 * @param needs 需要的权限
 * @returns 是否拥有权限
 * @description 适用 minimatch 匹配字符串
 * @example auth("admin") // 是否拥有 admin 权限
 * @example auth("*") // 是否拥有 任意 权限
 * @example auth("admin", "user") // 是否拥有 admin 和 user 权限
 * @example auth(role("admin"), "user") // 是否拥有 admin 角色 和 user 权限
 * @example auth("|", "user", "admin") // 是否拥有 user 或 admin 权限
 * @example auth("!", "user", "admin") // 是否没有 user 和 admin 权限
 * @example auth("|", ["user", "admin"], "all") // 是否 (同时拥有 user 和 admin 权限) 或 具有 all 权限
 * @example auth(page) // 是否可以访问某一页面 FastAuthPage
 */
export function $auth(
  ...needs:
    | (FastAuthBase | FastAuthPage)[]
    | [
        (
          | LiteralUnion<"!" | "|", FastAuthPer>
          | Exclude<FastAuthBase, FastAuthPer>
          | FastAuthPage
          | NuxtApp
        ),
        ...(FastAuthBase | FastAuthPage)[],
      ]
): boolean {
  let nuxtApp: NuxtApp | undefined;
  if (needs[0] instanceof Object && "globalName" in needs[0]) {
    nuxtApp = needs.shift() as NuxtApp;
  }
  const { status, roles, permissions } = useAuth(nuxtApp);
  const _has = [
    status.value.authed ?? false,
    ...roles.value,
    ...permissions.value,
  ];
  const _needs = (needs as (FastAuthBase | FastAuthPage)[]).map((need) => {
    const value = toValue(need);
    return isAuthPage(value) ? getAuthPageFilled(value, nuxtApp).auth : value;
  });
  return have(_has, _needs as FastAuthBase);
}
