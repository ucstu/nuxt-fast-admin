<template>
  <slot v-bind="props" :options="options">
    <fc-crud v-bind="props" :options="options" />
  </slot>
</template>

<script lang="ts" setup>
import {
  shallowRef,
  useNuxtApp,
  useRoute,
  type OpenFetchClient,
} from "#imports";
import type { CrudOptions } from "@ucstu/nuxt-fast-crud/exports";
import { useAsyncState } from "@ucstu/nuxt-fast-utils/exports";

defineOptions({
  name: "FaPagesCrud",
});

const props = defineProps<{
  /**
   * 开启初始请求
   */
  initFetch?: boolean | "auto";
  /**
   * 覆盖及扩展 Crud 选项
   */
  overrides?: Partial<CrudOptions<unknown>>;
}>();

const route = useRoute();
const nuxtApp = useNuxtApp();

const { state: options } = useAsyncState(async () => {
  const result = shallowRef<CrudOptions<unknown>>({});
  try {
    $loadingBar.start();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await nuxtApp.callHook(
      "fast-admin:get-crud-options",
      nuxtApp[`$${[route.params.api].flat()[0]}`] as OpenFetchClient<unknown>,
      [route.params.resource].flat()[0],
      result,
    );
    $loadingBar.finish();
  } catch (error) {
    $loadingBar.error();
    throw error;
  }
  return result.value;
}, {});
</script>
