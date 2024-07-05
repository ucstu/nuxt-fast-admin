import { toRefDeep, useAppConfig } from "#imports";
import type {
  Get,
  OverrideProperties,
  ToRefDeep,
} from "@ucstu/nuxt-fast-utils/types";
import { get } from "lodash-es";
import { configKey, type ModuleConfigDefaults } from "../types";

type AppConfig = OverrideProperties<
  ReturnType<typeof useAppConfig>,
  { [configKey]: ModuleConfigDefaults }
>;

export function useModuleConfig(): ToRefDeep<AppConfig, typeof configKey>;
export function useModuleConfig<Key extends keyof ModuleConfigDefaults>(
  key: Key
): ToRefDeep<AppConfig, `${typeof configKey}.${Key}`>;
export function useModuleConfig<Key extends keyof ModuleConfigDefaults>(
  key?: Key
) {
  return toRefDeep(useAppConfig(), `${configKey}${key ? `.${key}` : ""}`);
}

export function getModuleConfig(): Get<AppConfig, typeof configKey>;
export function getModuleConfig<Key extends keyof ModuleConfigDefaults>(
  key: Key
): Get<AppConfig, `${typeof configKey}.${Key}`>;
export function getModuleConfig<Key extends keyof ModuleConfigDefaults>(
  key?: Key
) {
  return get(useAppConfig(), `${configKey}${key ? `.${key}` : ""}`);
}
