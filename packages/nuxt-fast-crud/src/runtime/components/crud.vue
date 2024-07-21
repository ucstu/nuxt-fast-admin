<template>
  <fs-page>
    <template #header>
      <slot name="header" />
    </template>
    <fs-crud v-bind="crudBinding" ref="crudRef">
      <template v-for="(_, slot) of slots" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </fs-crud>
    <template #footer>
      <slot name="footer" />
    </template>
  </fs-page>
</template>

<script setup lang="ts" generic="Res extends object">
import { useFs, watch } from "#imports";
import type { CrudOptions, FsFormWrapper } from "@ucstu/nuxt-fast-crud/exports";
import { computedEager, type Paths } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";

defineOptions({
  name: "FcCrud",
});

const props = withDefaults(
  defineProps<{
    /**
     * Crud 选项
     */
    options: CrudOptions<Res>;
    /**
     * 开启初始请求
     */
    initFetch?: boolean | "auto";
    /**
     * 覆盖及扩展 Crud 选项
     */
    overrides?: Partial<CrudOptions<Res>>;
  }>(),
  {
    initFetch: "auto",
    overrides: () => ({}),
  },
);

interface GlobalFormScope {
  index: number;
  mode: "add" | "view" | "edit";
  _self: InstanceType<typeof FsFormWrapper>;
  getFormData: () => Res;
}
interface SearchScope {
  index: number;
  mode: "search";
  row: Res;
  form: Partial<Res>;
}
interface CellScope {
  index: number;
  row: Res;
}
interface FormScope {
  index: number;
  mode: "add" | "view" | "edit";
  row: Res;
  form: Partial<Res>;
}
const slots = defineSlots<
  {
    "header"(): any;
    "header-top"(): any;
    "header-middle"(): any;
    "header-bottom"(): any;
    "actionbar-left"(): any;
    "actionbar-right"(): any;
    "toolbar-left"(): any;
    "toolbar-right"(): any;
    "pagination-left"(): any;
    "pagination-right"(): any;
    "footer-top"(): any;
    "footer-bottom"(): any;
    "form-header-left"(scope: GlobalFormScope): any;
    "form-header-right"(scope: GlobalFormScope): any;
    "form-header-action-left"(scope: GlobalFormScope): any;
    "form-header-action-right"(scope: GlobalFormScope): any;
    "form-body-top"(scope: GlobalFormScope): any;
    "form-body-bottom"(scope: GlobalFormScope): any;
    "form-footer-left"(scope: GlobalFormScope): any;
    "form-footer-right"(scope: GlobalFormScope): any;
    "footer"(): any;
  } & {
    [key in `search_${Paths<Res>}`]: (scope: SearchScope) => any;
  } & {
    [key in `cell_${Paths<Res>}`]: (scope: CellScope) => any;
  } & {
    [key in `form_${Paths<Res>}`]: (scope: FormScope) => any;
  }
>();

const options = computedEager(() => defu(props.overrides, props.options));
const result = useFs<Res>({
  createCrudOptions() {
    return {
      crudOptions: options.value,
    };
  },
});
defineExpose(result);

const { crudBinding, crudRef, crudExpose, resetCrudOptions } = result;

if (
  props.initFetch === true ||
  (props.initFetch === "auto" && options.value.request?.pageRequest)
) {
  await crudExpose.doRefresh();
}

watch(options, resetCrudOptions);
</script>
