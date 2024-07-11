import type { FastAuthBase, FastAuthMeta } from "../types";

/**
 * 是否为 FsAuthPage
 * @param pageOrMeta 元数据
 * @returns 是否为 FsAuthPage
 */
export function isAuthMeta(
  pageOrMeta: FastAuthMeta | FastAuthBase
): pageOrMeta is FastAuthMeta {
  return (
    pageOrMeta instanceof Object &&
    ("role" in pageOrMeta || "per" in pageOrMeta)
  );
}

/**
 * 是否为 FsAuthMeta
 * @param pageOrMeta 元数据
 * @returns 是否为 FsAuthMeta
 */
export function isAuthBase(
  pageOrMeta: FastAuthMeta | FastAuthBase
): pageOrMeta is FastAuthBase {
  return typeof pageOrMeta === "object" ? Array.isArray(pageOrMeta) : true;
}
