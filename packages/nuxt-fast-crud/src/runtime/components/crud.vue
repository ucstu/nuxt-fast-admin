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

<script setup lang="ts" generic="Res">
import { useFs, watch } from "#imports";
import type { CrudOptions } from "@ucstu/nuxt-fast-crud/exports";
import { computedEager, type Paths } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import type {
  GlobalFormScope,
  SearchScope,
  CellScope,
  FormScope,
} from "../types";

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

const slots = defineSlots<
  {
    "header"(): unknown;
    "header-top"(): unknown;
    "header-middle"(): unknown;
    "header-bottom"(): unknown;
    "actionbar-left"(): unknown;
    "actionbar-right"(): unknown;
    "toolbar-left"(): unknown;
    "toolbar-right"(): unknown;
    "pagination-left"(): unknown;
    "pagination-right"(): unknown;
    "footer-top"(): unknown;
    "footer-bottom"(): unknown;
    "form-header-left"(scope: GlobalFormScope<Res>): unknown;
    "form-header-right"(scope: GlobalFormScope<Res>): unknown;
    "form-header-action-left"(scope: GlobalFormScope<Res>): unknown;
    "form-header-action-right"(scope: GlobalFormScope<Res>): unknown;
    "form-body-top"(scope: GlobalFormScope<Res>): unknown;
    "form-body-bottom"(scope: GlobalFormScope<Res>): unknown;
    "form-footer-left"(scope: GlobalFormScope<Res>): unknown;
    "form-footer-right"(scope: GlobalFormScope<Res>): unknown;
    "cell-rowHandle-left"(scope: CellScope<Res>): unknown;
    "cell-rowHandle-middle"(scope: CellScope<Res>): unknown;
    "cell-rowHandle-right"(scope: CellScope<Res>): unknown;
    "footer"(): unknown;
  } & {
    [key in `search_${Paths<Res>}`]: (scope: SearchScope<Res>) => unknown;
  } & {
    [key in `cell_${Paths<Res>}`]: (scope: CellScope<Res>) => unknown;
  } & {
    [key in `form_${Paths<Res>}`]: (scope: FormScope<Res>) => unknown;
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
  try {
    await crudExpose.doRefresh();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    /* empty */
  }
}

watch(options, resetCrudOptions);
</script>
