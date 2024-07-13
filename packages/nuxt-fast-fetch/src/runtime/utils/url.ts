const protocolPattern = /^(\w{2,}):\/\//;

/**
 * Returns the protocol of the given URL, or `undefined` if it has no protocol.
 *
 * @param path
 */
export function getProtocol(path: string | undefined) {
  const match = protocolPattern.exec(path || "");
  if (match) {
    return match[1].toLowerCase();
  }
  return undefined;
}

/**
 * Determines whether the given path is a filesystem path.
 * This includes "file://" URLs.
 *
 * @param path
 */
export function isFileSystemPath(path: string | undefined) {
  // @ts-ignore
  // eslint-disable-next-line nuxt/prefer-import-meta
  if (typeof window !== "undefined" || process.browser) {
    // We're running in a browser, so assume that all paths are URLs.
    // This way, even relative paths will be treated as URLs rather than as filesystem paths
    return false;
  }

  const protocol = getProtocol(path);
  return protocol === undefined || protocol === "file";
}
