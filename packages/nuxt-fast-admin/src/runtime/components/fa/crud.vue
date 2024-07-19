<template>
  <fs-page>
    <fs-crud v-bind="crudBinding" ref="crudRef" />
  </fs-page>
</template>

<script setup lang="ts" generic="Res extends object">
import { onMounted, useFs, watch } from "#imports";
import type { CrudOptions } from "@ucstu/nuxt-fast-crud/exports";
import { computedEager } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";

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
