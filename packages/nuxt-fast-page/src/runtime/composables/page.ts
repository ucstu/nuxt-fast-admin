import {
  computed,
  ref,
  shallowComputedEager,
  toValue,
  useNuxtAppBack,
  useRouter,
  useState,
  type ComputedRef,
  type MaybeRefOrGetter,
} from "#imports";
import type { RouteLocationRaw, RouteMeta } from "#vue-router";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";

function _getPage(path: string) {
  const result = ref<RouteMeta>({});
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    "fast-page:complete",
    path,
    result
  );
  return result.value;
}

export function createPages<T extends RouteMeta = RouteMeta>(
  nuxtApp = useNuxtAppBack()
) {
  const { currentRoute } = useRouter();
  const origin = useState<Record<string, T>>("fast-page:pages", () => ({}));

  const result = shallowComputedEager(
    () =>
      Object.fromEntries(
        Object.entries(origin.value).map(([path, meta]) => [
          path,
          defu(meta, _getPage(path, nuxtApp)),
        ])
      ) as Record<string, T>
  );
  const current = computed(() => result.value[currentRoute.value.path]);

  return extendRef(result, {
    origin: extendRef(origin, {
      current: computed(() => origin.value[currentRoute.value.path]),
    }),
    current,
  });
}

export function useRouteMetas<T extends RouteMeta = RouteMeta>(
  nuxtApp = useNuxtAppBack()
) {
  return nuxtApp.$fastRoute?.routeMetas ?? createPages<T>();
}

export function useRouteMeta<T extends RouteMeta = RouteMeta>(
  origin?: MaybeRefOrGetter<boolean>
): ComputedRef<T>;
export function useRouteMeta<T extends RouteMeta = RouteMeta>(
  path?: MaybeRefOrGetter<RouteLocationRaw>,
  origin?: MaybeRefOrGetter<boolean>
): ComputedRef<T>;
export function useRouteMeta<T extends RouteMeta = RouteMeta>(
  pathOrOrigin?: MaybeRefOrGetter<RouteLocationRaw> | MaybeRefOrGetter<boolean>,
  origin: MaybeRefOrGetter<boolean> = false
) {
  const routeMetas = useRouteMetas<T>();
  const { origin: originRouteMetas, current } = routeMetas;
  const { current: originCurrent } = originRouteMetas;
  return computed(() => {
    const value = toValue(pathOrOrigin);
    if (typeof value === "boolean") return value ? originCurrent : current;
    if (!value) return toValue(origin) ? originCurrent : current;
    return (toValue(origin) ? originRouteMetas : routeMetas.value)[
      typeof value === "string" ? value : value.path!
    ];
  });
}

export function getRouteMeta<T extends RouteMeta = RouteMeta>(
  origin?: MaybeRefOrGetter<boolean>
): T;
export function getRouteMeta<T extends RouteMeta = RouteMeta>(
  path?: MaybeRefOrGetter<RouteLocationRaw>,
  origin?: MaybeRefOrGetter<boolean>
): T;
export function getRouteMeta<T extends RouteMeta = RouteMeta>(
  pathOrOrigin?: MaybeRefOrGetter<RouteLocationRaw> | MaybeRefOrGetter<boolean>,
  origin: MaybeRefOrGetter<boolean> = false
) {
  const routeMetas = useRouteMetas<T>();
  const { origin: originRouteMetas, current } = routeMetas;
  const { current: originCurrent } = originRouteMetas;
  const value = toValue(pathOrOrigin);
  if (typeof value === "boolean") return value ? originCurrent : current;
  if (!value) return toValue(origin) ? originCurrent : current;
  return (toValue(origin) ? originRouteMetas : routeMetas.value)[
    typeof value === "string" ? value : value.path!
  ];
}
