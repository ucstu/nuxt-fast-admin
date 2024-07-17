import type { NuxtApp } from "#app";
import { onNuxtReady, shallowRef, tryUseNuxtApp } from "#imports";

/**
 * 使用 Nuxt 是否就绪
 */
export function useNuxtReady() {
  const isReady = shallowRef(false);
  onNuxtReady(() => (isReady.value = true));
  return isReady;
}

export const nuxtApp = shallowRef<NuxtApp>();

/**
 * 使用 Nuxt App
 */
export function useNuxtAppBack() {
  return tryUseNuxtApp() ?? nuxtApp.value!;
}

/**
 * 使用 Nuxt App
 */
export function tryUseNuxtAppBack() {
  return tryUseNuxtApp() ?? nuxtApp.value;
}
