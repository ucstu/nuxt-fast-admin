import type { FsAuthMeta, FsAuthPage } from "../types";

/**
 * 是否为 FsAuthPage
 * @param meta 元数据
 * @returns 是否为 FsAuthPage
 */
export function isFsAuthPage(
  meta: FsAuthPage | FsAuthMeta,
): meta is FsAuthPage {
  return meta instanceof Object && "auth" in meta;
}
