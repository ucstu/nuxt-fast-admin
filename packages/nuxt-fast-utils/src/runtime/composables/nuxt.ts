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
import { klona } from "klona";

/**
 * 使用 Nuxt 是否就绪
 */
export function useNuxtReady() {
  const isReady = shallowRef(false);
  onNuxtReady(() => (isReady.value = true));
  return isReady;
}

export function $useAppConfig(
  nuxtApp: NuxtApp = useNuxtApp(),
): ReturnType<typeof useAppConfig> {
  try {
    return useAppConfig();
  } catch {
    if (!nuxtApp._appConfig) {
      nuxtApp._appConfig = (
        import.meta.server ? klona(__appConfig) : reactive(__appConfig)
      ) as any;
    }
    return nuxtApp._appConfig as any;
  }
}

export function $useRouter(
  nuxtApp: NuxtApp = useNuxtApp(),
): ReturnType<typeof useRouter> {
  try {
    return useRouter();
  } catch {
    return nuxtApp.$router as any;
  }
}

export function $useRuntimeConfig(
  nuxtApp: NuxtApp = useNuxtApp(),
): ReturnType<typeof useRuntimeConfig> {
  try {
    return useRuntimeConfig();
  } catch {
    return nuxtApp.$config as any;
  }
}
