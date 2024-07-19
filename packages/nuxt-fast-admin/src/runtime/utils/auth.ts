import type { $auth as __$auth, auth as __auth } from "#imports";
import { computed, shallowRef } from "#imports";

export const _$auth = shallowRef<typeof __$auth>(() => true);
export const _auth = shallowRef<typeof __auth>(() => computed(() => true));

export const auth: typeof __auth = (...args) => _auth.value(...args);
export const $auth: typeof __$auth = _$auth.value;
