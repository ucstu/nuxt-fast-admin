import { onNuxtReady, shallowRef } from "#imports";

/**
 * 使用 Nuxt 是否就绪
 */
export function useNuxtReady() {
  const isReady = shallowRef(false);
  onNuxtReady(() => (isReady.value = true));
  return isReady;
}
