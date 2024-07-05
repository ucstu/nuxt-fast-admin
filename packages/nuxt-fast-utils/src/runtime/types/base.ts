import type { RouteMeta } from "#vue-router";
import type { Get, LiteralUnion, Paths } from "type-fest";
import type { WritableComputedRef } from "vue";

export const configKey = "fastUtils";

export interface RouteMetas<T extends RouteMeta = RouteMeta> {
  [path: string]: T;
}

export type ToRefDeep<
  T extends object,
  K extends LiteralUnion<Paths<T>, string>,
  V extends Get<T, `${K}`> = Get<T, `${K}`>
> = WritableComputedRef<V>;
