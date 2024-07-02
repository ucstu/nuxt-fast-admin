import type { PartialDeep } from "type-fest";

export function override<T extends object>(target: T, source: PartialDeep<T>) {
  Object.assign(target, source);
}
