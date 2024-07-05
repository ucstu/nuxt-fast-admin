import type { NuxtApp } from "#app";
import { onNuxtReady, shallowRef, tryUseNuxtApp } from "#imports";

export const nuxtApp = shallowRef<NuxtApp>();

export function useSafeNuxtApp() {
  return tryUseNuxtApp() ?? nuxtApp.value!;
}

export function useNuxtReady() {
  const isReady = shallowRef(false);
  onNuxtReady(() => (isReady.value = true));
  return isReady;
}
