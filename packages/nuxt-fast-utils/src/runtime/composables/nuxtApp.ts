import type { NuxtApp } from "#app";
import { shallowRef, tryUseNuxtApp } from "#imports";

export const nuxtApp = shallowRef<NuxtApp>();

export function useFsNuxtApp() {
  return tryUseNuxtApp() ?? nuxtApp.value!;
}
