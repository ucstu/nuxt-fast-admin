import { toValue, type MaybeRefOrGetter } from "#imports";
import type { CrudOptions } from "@fast-crud/fast-crud";
import { computedEager } from "@ucstu/nuxt-fast-utils/exports";

export function defineCrudOptions<T>(
  options: MaybeRefOrGetter<CrudOptions<T>>
) {
  return computedEager(() => toValue(options));
}
