import type { CrudOptions } from "@fast-crud/fast-crud";
export * from "@fast-crud/fast-crud";

export function defineCrudOptions<Res>(
  options: CrudOptions<Res>,
): CrudOptions<Res> {
  return options;
}
