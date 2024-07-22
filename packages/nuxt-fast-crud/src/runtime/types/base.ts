import type { FsFormWrapper } from "@ucstu/nuxt-fast-crud/exports";

export interface GlobalFormScope<Res> {
  index: number;
  mode: "add" | "view" | "edit";
  _self: InstanceType<typeof FsFormWrapper>;
  getFormData: () => Res;
}
export interface SearchScope<Res> {
  index: number;
  mode: "search";
  row: Res;
  form: Partial<Res>;
}
export interface CellScope<Res> {
  index: number;
  row: Res;
}
export interface FormScope<Res> {
  index: number;
  mode: "add" | "view" | "edit";
  row: Res;
  form: Partial<Res>;
}
