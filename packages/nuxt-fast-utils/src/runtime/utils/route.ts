import { useRouter } from "#imports";
import {
  type RouteLocationNormalized,
  type RouteRecordNormalized,
} from "#vue-router";
import type { RouteRecordOrLocation } from "../types/index";

export function isRouteRecordNormalized(
  maybeRouteRecordNormalized: RouteRecordOrLocation
): maybeRouteRecordNormalized is RouteRecordNormalized {
  return (
    maybeRouteRecordNormalized !== null &&
    typeof maybeRouteRecordNormalized === "object" &&
    "meta" in maybeRouteRecordNormalized &&
    "components" in maybeRouteRecordNormalized
  );
}

export function isRouteLocationNormalized(
  maybeRouteLocationNormalized: RouteRecordOrLocation
): maybeRouteLocationNormalized is RouteLocationNormalized {
  return (
    maybeRouteLocationNormalized !== null &&
    typeof maybeRouteLocationNormalized === "object" &&
    "meta" in maybeRouteLocationNormalized &&
    "matched" in maybeRouteLocationNormalized
  );
}

export function findRouteRecordNormalized(
  routeRecordOrLocation: RouteRecordOrLocation | undefined
) {
  const router = useRouter();
  const routes = router.getRoutes();
  if (!routeRecordOrLocation) {
    return routes.find(
      (route) => route.path === router.currentRoute.value.path
    );
  } else {
    if (isRouteRecordNormalized(routeRecordOrLocation)) {
      return routeRecordOrLocation;
    } else if (isRouteLocationNormalized(routeRecordOrLocation)) {
      const routeLocationNormalized = routeRecordOrLocation;
      return routes.find(
        (route) => route.path === routeLocationNormalized.path
      );
    } else if (typeof routeRecordOrLocation === "string") {
      return routes.find((route) => route.path === routeRecordOrLocation);
    } else {
      const routeLocationRaw = routeRecordOrLocation;
      return routes.find((route) => route.path === routeLocationRaw.path);
    }
  }
}
