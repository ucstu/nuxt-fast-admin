import type { NuxtApp } from "#app";
import __appConfig from "#build/app.config.mjs";
import {
  onNuxtReady,
  reactive,
  shallowRef,
  useAppConfig,
  useNuxtApp,
  useRouter,
  useRuntimeConfig,
} from "#imports";
import type { Router } from "#vue-router";
import { klona } from "klona";
import type { AppConfig, RuntimeConfig } from "nuxt/schema";

/**
 * 使用 Nuxt 是否就绪
 */
export function useNuxtReady() {
  const isReady = shallowRef(false);
  onNuxtReady(() => (isReady.value = true));
  return isReady;
}

export function $useAppConfig(nuxtApp: NuxtApp = useNuxtApp()): AppConfig {
  try {
    return useAppConfig();
  } catch {
    if (!nuxtApp._appConfig) {
      nuxtApp._appConfig = (
        import.meta.server ? klona(__appConfig) : reactive(__appConfig)
      ) as typeof nuxtApp._appConfig;
    }
    return nuxtApp._appConfig as AppConfig;
  }
}

export function $useRouter(nuxtApp: NuxtApp = useNuxtApp()): Router {
  try {
    return useRouter();
  } catch {
    return nuxtApp.$router as unknown as Router;
  }
}

export function $useRuntimeConfig(
  nuxtApp: NuxtApp = useNuxtApp()
): RuntimeConfig {
  try {
    return useRuntimeConfig();
  } catch {
    return nuxtApp.$config as unknown as RuntimeConfig;
  }
}
