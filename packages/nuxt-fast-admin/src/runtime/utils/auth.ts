// @ts-ignore
import type { $auth as __$auth, auth as __auth } from "#imports";
import { computed, ref, shallowRef } from "#imports";
import type { FastAuthToken } from "@ucstu/nuxt-fast-auth/types";

export const _$auth = shallowRef<typeof __$auth>(() => true);
export const _auth = shallowRef<typeof __auth>(() => computed(() => true));

// @ts-ignore
export const auth: typeof __auth = (...args) => _auth.value(...args);
export const $auth: typeof __$auth = _$auth.value;

export const _token = ref<FastAuthToken>();
