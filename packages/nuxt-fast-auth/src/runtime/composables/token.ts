import { useAppConfigRef } from "./config";

/**
 * 使用 token 过期时间
 * @param remember 记住登录状态
 * @returns 过期时间
 */
export function useTokenExpires(
  remember?: boolean | number | undefined | null,
) {
  const config = useAppConfigRef("fastAuth").value!;
  if (remember === false) return 0;
  const defaultExpires = config.provider!.tokenExpires;
  if (remember === undefined || remember === null || remember === true)
    return defaultExpires ? new Date(Date.now() + defaultExpires * 1000) : 0;
  return remember ? new Date(Date.now() + remember * 1000) : 0;
}
