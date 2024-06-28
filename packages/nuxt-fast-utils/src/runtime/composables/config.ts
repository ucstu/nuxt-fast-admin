import type { ResolvedAppConfig } from "#build/types/app.config";
import { useAppConfig } from "#imports";
import { get } from "lodash-es";
import type { Get, LiteralUnion, Paths } from "type-fest";
import { toRefDeep, type ToRefDeep } from "./reactivity";

type AppConfig = ReturnType<typeof useAppConfig>;
type Keys = LiteralUnion<Paths<ResolvedAppConfig>, string>;

export function refAppConfig<K extends Keys = Keys>(
  key: K
): ToRefDeep<AppConfig, K>;
export function refAppConfig<
  D extends Get<AppConfig, `${K}`>,
  K extends Keys = Keys
>(key: K, defaultValue: D): ToRefDeep<AppConfig, K, D>;
export function refAppConfig<
  D extends Get<AppConfig, `${K}`>,
  K extends Keys = Keys
>(key: K, defaultValue: undefined, direct: boolean): D;
export function refAppConfig<
  D extends Get<AppConfig, `${K}`> | undefined,
  K extends Keys = Keys
>(key: K, defaultValue?: D, direct?: boolean) {
  const config = useAppConfig();
  if (direct) return config[key];
  const result = toRefDeep(config, key);
  if (defaultValue !== undefined && result.value === undefined) {
    result.value = defaultValue;
  }
  return result;
}

export function getAppConfig<K extends Keys = Keys>(key: K): AppConfig[K] {
  return get(useAppConfig(), key);
}
