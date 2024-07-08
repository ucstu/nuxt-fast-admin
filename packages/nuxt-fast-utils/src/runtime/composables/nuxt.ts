import { useAppConfig as _useAppConfig } from "#app/config";
import type { ResolvedAppConfig } from "#build/types/app.config";
import {
  computed,
  onNuxtReady,
  readonly,
  shallowReadonly,
  shallowRef,
  useRuntimeConfig,
} from "#imports";
import type { AppConfig, RuntimeConfig } from "@nuxt/schema";
import { toRef } from "@vueuse/core";
import { get, set } from "lodash-es";
import type { Get, LiteralUnion, OverrideProperties, Paths } from "type-fest";
import type { DeepReadonly, ToRef, WritableComputedRef } from "vue-demi";
import type { AppConfigOverrides } from "../types";

/**
 * 使用 Nuxt 是否就绪
 */
export function useNuxtReady() {
  const isReady = shallowRef(false);
  onNuxtReady(() => (isReady.value = true));
  return isReady;
}

type AppConfigOverride = OverrideProperties<AppConfig, AppConfigOverrides>;

type ConfigType = "app" | "private" | "public";
interface UseNuxtConfigOptions<T extends ConfigType, D> {
  /**
   * 配置类型
   *
   * - `app` - 应用配置
   * - `private` - 私有配置
   * - `public` - 公开配置
   * @default "app"
   */
  type?: T;
  /**
   * 是否只读
   * @default type !== "app"
   */
  readonly?: boolean;
  /**
   * 浅层只读
   * @default false
   */
  shallow?: boolean;
  /**
   * 默认值
   */
  default?: D extends undefined ? never : () => D;
}
export function useNuxtConfig(): ToRef<AppConfigOverride>;
export function useNuxtConfig<
  K extends LiteralUnion<Paths<ResolvedAppConfig>, string>
>(key: K): WritableComputedRef<Get<AppConfigOverride, K>>;
export function useNuxtConfig<
  T extends "app",
  K extends LiteralUnion<Paths<ResolvedAppConfig>, string>
>(
  key: K,
  options: UseNuxtConfigOptions<T, Get<AppConfigOverride, K>>
): WritableComputedRef<Get<AppConfigOverride, K>>;
export function useNuxtConfig<
  T extends Exclude<ConfigType, "app">,
  C extends T extends "private" ? RuntimeConfig : RuntimeConfig["public"],
  K extends LiteralUnion<Paths<C>, string>
>(
  key: K,
  options: UseNuxtConfigOptions<T, Get<C, K>>
): DeepReadonly<WritableComputedRef<Get<C, K>>>;
/**
 * 使用 Nuxt 应用配置
 * @param key 配置键
 * @returns 配置值
 */
export function useNuxtConfig<
  T extends ConfigType,
  C extends T extends "app"
    ? AppConfig
    : T extends "private"
    ? RuntimeConfig
    : RuntimeConfig["public"],
  K extends LiteralUnion<Paths<C>, string>
>(key?: K, options?: UseNuxtConfigOptions<T, Get<C, K>>) {
  const {
    type = "app",
    shallow = false,
    default: defaultValue,
  } = options || {};
  const isReadonly = options?.readonly ?? type !== "app";

  const appConfig = _useAppConfig();
  const runtimeConfig = useRuntimeConfig();

  const config =
    type === "app"
      ? appConfig
      : type === "private"
      ? runtimeConfig
      : runtimeConfig.public;

  const result = configRef(config, key);

  if (!isReadonly) {
    if (result.value === undefined && defaultValue) {
      result.value = defaultValue() as Get<C, K>;
    }
    return result;
  }

  return (shallow ? shallowReadonly : readonly)(result);
}

function configRef<
  C extends AppConfig | RuntimeConfig | RuntimeConfig["public"],
  K extends Paths<C>
>(config: C, key?: K) {
  return key
    ? computed({
        get() {
          return get(config, key);
        },
        set(value) {
          set(config, key, value);
        },
      })
    : toRef(config);
}
