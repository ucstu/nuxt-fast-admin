import {
  computed,
  toValue,
  useNuxtApp,
  useRouter,
  useState,
  type MaybeRefOrGetter,
} from "#imports";
import type { RouteMeta } from "#vue-router";
import { extendRef } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import type { RouteMetas } from "../types";

export function useOriginalRouteMetas<T extends RouteMeta = RouteMeta>() {
  const router = useRouter();

  const result = useState<RouteMetas<T>>(
    "fast-utils:original-route-metas",
    () => ({})
  );

  return extendRef(result, {
    get(path: string) {
      return result.value[path] ?? undefined;
    },
    set(path: string, value: T) {
      result.value[path] = value;
    },
    has(path: string) {
      return path in result.value;
    },
    remove(path: string) {
      delete result.value[path];
    },
    clear() {
      Object.keys(result.value).forEach((key) => {
        delete result.value[key];
      });
    },
  });
}

function deleteOtherKeyByObj(obj: object, other: object) {
  for (const _key in obj) {
    const key = _key as keyof typeof obj & keyof typeof other;
    if (!(key in other)) {
      delete obj[key];
    } else {
      if (typeof obj[key] === "object" && typeof other[key] === "object") {
        deleteOtherKeyByObj(obj[_key as keyof typeof obj], other[key]);
      }
    }
  }
}

export function useRouteMetas<T extends RouteMeta = RouteMeta>() {
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  const originalRouteMetas = useOriginalRouteMetas<T>();

  const result = useState<RouteMetas<T>>("fast-utils:route-metas", () => ({}));

  return extendRef(result, {
    get(path: string) {
      return result.value[path] ?? undefined;
    },
    set(path: string, value: T) {
      result.value[path] = value;
    },
    has(path: string) {
      return path in result.value;
    },
    remove(path: string) {
      delete result.value[path];
    },
    clear() {
      Object.keys(result.value).forEach((key) => {
        delete result.value[key];
      });
    },
    async refresh(override = false) {
      for (const route of router.getRoutes()) {
        // 如果有没有被初始化路由元信息，则初始化
        if (!result.value[route.path]) {
          result.value[route.path] = {} as T;
          route.meta = result.value[route.path]!;
        }
        const routeMeta = cloneDeep(
          originalRouteMetas.get(route.path) ?? ({} as T)
        );
        await nuxtApp.callHook("fast-utils:get-route-meta", route, routeMeta);
        Object.assign(result.value[route.path], routeMeta);
        if (override) {
          deleteOtherKeyByObj(result.value[route.path], routeMeta);
        }
      }
    },
  });
}

export function useRouteMeta<T = RouteMeta>(path?: MaybeRefOrGetter<string>) {
  const routeMetas = useRouteMetas();
  const { currentRoute } = useRouter();
  return computed(
    () => routeMetas.value[toValue(path) ?? currentRoute.value.path] as T
  );
}

export function getRouteMeta<T = RouteMeta>(path: string) {
  const routeMetas = useRouteMetas();
  return routeMetas.value[path] as T;
}
