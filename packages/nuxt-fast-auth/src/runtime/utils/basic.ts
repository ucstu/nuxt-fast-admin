import type { FsAuthMeta, FsAuthPage } from "../types";

/**
 * 是否为 FsAuthPage
 * @param pageOrMeta 元数据
 * @returns 是否为 FsAuthPage
 */
export function isFsAuthPage(
  pageOrMeta: FsAuthPage | FsAuthMeta,
): pageOrMeta is FsAuthPage {
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
export function isFsAuthMeta(
  pageOrMeta: FsAuthPage | FsAuthMeta,
): pageOrMeta is FsAuthMeta {
  return typeof pageOrMeta === "object" ? Array.isArray(pageOrMeta) : true;
}
