import {
  computed,
  toValue,
  useRouter,
  useState,
  type MaybeRefOrGetter,
} from "#imports";
import type { RouteLocationRaw, RouteMeta } from "#vue-router";

export function useRouteMetas<T extends RouteMeta = RouteMeta>() {
  return useState<Record<string, T>>("fast-route:metas", () => ({}));
}

export function useRouteMeta<T extends RouteMeta = RouteMeta>(
  path?: MaybeRefOrGetter<RouteLocationRaw>
) {
  const routeMetas = useRouteMetas<T>();
  const { currentRoute } = useRouter();
  return computed(() => {
    const value = toValue(path);
    return routeMetas.value[
      (typeof value === "string" ? value : value?.path) ??
        currentRoute.value.path
    ];
  });
}

export function getRouteMeta<T extends RouteMeta = RouteMeta>(
  path?: MaybeRefOrGetter<RouteLocationRaw>
) {
  const routeMetas = useRouteMetas<T>();
  const { currentRoute } = useRouter();
  const value = toValue(path);
  return routeMetas.value[
    (typeof value === "string" ? value : value?.path) ?? currentRoute.value.path
  ];
}
