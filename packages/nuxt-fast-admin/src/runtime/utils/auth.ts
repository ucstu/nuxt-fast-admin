import { shallowRef } from "#imports";
import type { FastAuthPage } from "@ucstu/nuxt-fast-auth/types";

export const authPageRef = shallowRef<(page: FastAuthPage) => boolean>(
  () => true,
);

export function authPage(page: FastAuthPage) {
  return authPageRef.value(page);
}
