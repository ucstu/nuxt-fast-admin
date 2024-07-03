import {
  computed,
  ref,
  toValue,
  useFsNuxtApp,
  useRouter,
  useState,
  type ComputedRef,
  type MaybeRefOrGetter,
} from "#imports";
import type { RouteLocationRaw, RouteMeta } from "#vue-router";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";

function _getRouteMeta(path: string, nuxtApp = useFsNuxtApp()) {
  const result = ref<RouteMeta>({});
  nuxtApp.hooks.callHookWith(
    (hooks, args) => hooks.forEach((hook) => hook(...args)),
    "fast-route:get-meta",
    path,
    result
  );
  return result.value;
}

export function useRouteMetas<T extends RouteMeta = RouteMeta>() {
  const origin = useState<Record<string, T>>("fast-route:metas", () => ({}));

  const result = computed(
    () =>
      Object.fromEntries(
        Object.entries(origin.value).map(([path, meta]) => [
          path,
          defu(meta, _getRouteMeta(path)),
        ])
      ) as Record<string, T>
  );

  return extendRef(result, {
    origin,
  });
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
  const { currentRoute } = useRouter();
  const { origin: originRouteMetas } = routeMetas;
  return computed(() => {
    const value = toValue(pathOrOrigin);
    if (typeof value === "boolean") {
      return (value ? originRouteMetas : routeMetas.value)[
        currentRoute.value.path
      ];
    }
    return (toValue(origin) ? originRouteMetas : routeMetas.value)[
      (typeof value === "string" ? value : value?.path) ??
        currentRoute.value.path
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
  path?: MaybeRefOrGetter<RouteLocationRaw> | MaybeRefOrGetter<boolean>,
  origin: MaybeRefOrGetter<boolean> = false
) {
  const routeMetas = useRouteMetas<T>();
  const { currentRoute } = useRouter();
  const { origin: originRouteMetas } = routeMetas;
  const value = toValue(path);
  if (typeof value === "boolean") {
    return (value ? originRouteMetas : routeMetas.value)[
      currentRoute.value.path
    ];
  }
  return (origin ? originRouteMetas : routeMetas.value)[
    (typeof value === "string" ? value : value?.path) ?? currentRoute.value.path
  ];
}
