import { syncRef, type SyncRefOptions } from "@vueuse/core";

type Direction = "ltr" | "rtl" | "both";
export function useSync<T, D extends Direction>(
  source: Ref<T>,
  options?: SyncRefOptions<T, T, D>,
): Ref<T> {
  const target = ref<T>() as Ref<T>;
  syncRef<T, T, D>(source, target, options as any);
  return target;
}
