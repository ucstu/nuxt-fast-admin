import type { FastAuthBase, FastAuthMeta, FastAuthPage } from "../types";

/**
 * 是否为 FsAuthPage
 * @param metaOrBase 元数据
 * @returns 是否为 FsAuthPage
 */
export function isAuthMeta(
  metaOrBase: FastAuthMeta | FastAuthBase | undefined,
): metaOrBase is FastAuthMeta {
  return metaOrBase instanceof Object;
}

/**
 * 是否为 FsAuthMeta
 * @param metaOrBase 元数据
 * @returns 是否为 FsAuthMeta
 */
export function isAuthBase(
  metaOrBase: FastAuthMeta | FastAuthBase,
): metaOrBase is FastAuthBase {
  return metaOrBase instanceof Object ? Array.isArray(metaOrBase) : true;
}

/**
 * 是否为 FsAuthPage
 */
export function isAuthPage(
  pageOrBase: FastAuthBase | FastAuthPage,
): pageOrBase is FastAuthPage {
  return (
    pageOrBase instanceof Object &&
    !Array.isArray(pageOrBase) &&
    "to" in pageOrBase
  );
}
