<template>
  <fc-crud v-bind="props" :options="options">
    <template v-for="(_, slot) of slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </fc-crud>
</template>

<script setup lang="ts" generic="Res">
import type { FcCrud } from "#components";
import {
  shallowRef,
  useAsyncData,
  useNuxtApp,
  useRoute,
  type OpenFetchClient,
} from "#imports";
import type { CrudOptions } from "@ucstu/nuxt-fast-crud/exports";
import type {
  CellScope,
  FormScope,
  GlobalFormScope,
  SearchScope,
} from "@ucstu/nuxt-fast-crud/types";
import type { Paths } from "@ucstu/nuxt-fast-utils/exports";

defineOptions({
  name: "FaPagesCrud",
});

const props = withDefaults(
  defineProps<{
    /**
     * 开启初始请求
     */
    initFetch?: boolean | "auto";
    /**
     * 覆盖及扩展 Crud 选项
     */
    overrides?: Partial<CrudOptions<Res>>;
    /**
     * API
     */
    api?: OpenFetchClient<unknown>;
    /**
     * 资源
     */
    resource?: string;
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

const route = useRoute();
const nuxtApp = useNuxtApp();

const { data: options } = await useAsyncData(
  async () => {
    const result = shallowRef<CrudOptions<unknown>>({});
    try {
      $loadingBar.start();
      await nuxtApp.callHook(
        "fast-admin:get-crud-options",
        props.api ??
          (nuxtApp[
            `$${[route.params.api].flat()[0] ?? route.path.split("/")[2]}`
          ] as OpenFetchClient<unknown>),
        props.resource ??
          [route.params.resource].flat()[0] ??
          route.path.split("/")[3],
        result,
      );
      $loadingBar.finish();
    } catch (error) {
      $loadingBar.error();
      throw error;
    }
    return result.value as CrudOptions<Res>;
  },
  {
    default() {
      return {};
    },
  },
);
</script>
