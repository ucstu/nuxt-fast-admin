import type { RuntimeNuxtHooks } from "#app";
import { useNuxtApp } from "#imports";
import type { HookKeys } from "hookable";

export function callHookSync<
  NameT extends HookKeys<RuntimeNuxtHooks> = HookKeys<RuntimeNuxtHooks>
>(
  name: NameT,
  ...args: Parameters<RuntimeNuxtHooks[NameT]>
): ReturnType<RuntimeNuxtHooks[NameT]> {
  const nuxtApp = useNuxtApp();
  nuxtApp.hooks.callHookParallel;
  return nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.map((hook) => hook(...args)),
    name,
    ...args
  ) as ReturnType<RuntimeNuxtHooks[NameT]>;
}

export function callHookParallelSync<
  NameT extends HookKeys<RuntimeNuxtHooks> = HookKeys<RuntimeNuxtHooks>
>(
  name: NameT,
  ...args: Parameters<RuntimeNuxtHooks[NameT]>
): Array<ReturnType<RuntimeNuxtHooks[NameT]>> {
  const nuxtApp = useNuxtApp();
  return nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.map((hook) => hook(...args)),
    name,
    ...args
  ) as Array<ReturnType<RuntimeNuxtHooks[NameT]>>;
}
