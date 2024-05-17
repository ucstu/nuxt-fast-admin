import type { ResolvedAppConfig } from "#build/types/app.config";
import { useAppConfig } from "#imports";
import type { AppConfig } from "nuxt/schema";
import type { Get, LiteralUnion, Paths } from "type-fest";
import { toRefDeep, type ToRefDeep } from "./basic";

type Keys = LiteralUnion<Paths<ResolvedAppConfig>, string>;

export function useAppConfigRef<D extends undefined, K extends Keys = Keys>(
  key: K,
): ToRefDeep<AppConfig, K, D>;
export function useAppConfigRef<
  D extends Get<AppConfig, `${K}`>,
  K extends Keys = Keys,
>(key: K, defaultValue: D): ToRefDeep<AppConfig, K, D>;
export function useAppConfigRef<
  D extends Get<AppConfig, `${K}`> | undefined,
  K extends Keys = Keys,
>(key: K, defaultValue?: D) {
  const config = useAppConfig();
  if (defaultValue === undefined) {
    return toRefDeep<undefined, AppConfig>(config, key);
  }
  return toRefDeep<D, AppConfig>(config, key, defaultValue);
}
