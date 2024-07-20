<template>
  <fs-page>
    <template #header>
      <slot name="header" />
    </template>
    <fs-crud v-bind="crudBinding" ref="crudRef">
      <template #header-top>
        <slot name="header-top" />
      </template>
      <template #header-middle>
        <slot name="header-middle" />
      </template>
      <template #header-bottom>
        <slot name="header-bottom" />
      </template>
      <template #actionbar-left>
        <slot name="actionbar-left" />
      </template>
      <template #actionbar-right>
        <slot name="actionbar-right" />
      </template>
      <template #toolbar-left>
        <slot name="toolbar-left" />
      </template>
      <template #toolbar-right>
        <slot name="toolbar-right" />
      </template>
      <template #pagination-left>
        <slot name="pagination-left" />
      </template>
      <template #pagination-right>
        <slot name="pagination-right" />
      </template>
      <template #footer-top>
        <slot name="footer-top" />
      </template>
      <template #footer-bottom>
        <slot name="footer-bottom" />
      </template>
      <template #form-header-left="scope">
        <slot name="form-header-left" v-bind="scope" />
      </template>
      <template #form-header-right="scope">
        <slot name="form-header-right" v-bind="scope" />
      </template>
      <template #form-header-action-left="scope">
        <slot name="form-header-action-left" v-bind="scope" />
      </template>
      <template #form-header-action-right="scope">
        <slot name="form-header-action-right" v-bind="scope" />
      </template>
      <template #form-body-top="scope">
        <slot name="form-body-top" v-bind="scope" />
      </template>
      <template #form-body-bottom="scope">
        <slot name="form-body-bottom" v-bind="scope" />
      </template>
      <template #form-footer-left="scope">
        <slot name="form-footer-left" v-bind="scope" />
      </template>
      <template #form-footer-right="scope">
        <slot name="form-footer-right" v-bind="scope" />
      </template>
    </fs-crud>
    <template #footer>
      <slot name="footer" />
    </template>
  </fs-page>
</template>

<script setup lang="ts" generic="Res extends object">
import { onMounted, watch } from "#imports";
import { useFs, type CrudOptions, type FsFormWrapper } from "@ucstu/nuxt-fast-crud/exports";
import { computedEager } from "@ucstu/nuxt-fast-utils/exports";
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
  }
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
defineSlots<{
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
  [key in `search_${Paths<Res>}`]: (scope: SearchScope)=> any;
  [key in `cell_${Paths<Res>}`]: (scope: CellScope)=> any;
  [key in `form_${Paths<Res>}`]: (scope: FormScope)=> any;
  "footer"(): any;
}>();

const options = computedEager(() => defu(props.overrides, props.options));
const result = useFs<Res>({
  createCrudOptions() {
    return {
      crudOptions: props.options,
    };
  },
});

const { crudBinding, crudRef, crudExpose, resetCrudOptions } = result;

onMounted(async () => {
  if (
    props.initFetch === true ||
    (props.initFetch === "auto" && options.value.request?.pageRequest)
  ) {
    await crudExpose.doRefresh();
  }
});

watch(options, resetCrudOptions);
</script>
