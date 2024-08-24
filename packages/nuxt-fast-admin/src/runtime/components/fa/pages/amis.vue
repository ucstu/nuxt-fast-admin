<template>
  <amis-render
    :schema="schema"
    :options="options"
    :props="props.props"
    :path-prefix="pathPrefix"
  />
</template>

<script lang="ts" setup>
import { shallowRef, useAsyncData, useNuxtApp, useRoute } from "#imports";
import type { RenderOptions, Schema } from "@ucstu/nuxt-amis/exports";

defineOptions({
  name: "FaPagesAmis",
});

const props = defineProps<{
  /**
   * 资源
   */
  name?: string;
  props?: {
    location?: Location;
    theme?: string;
    data?: Record<string, unknown>;
    locale?: string;
    [propName: string]: unknown;
  };
  options?: RenderOptions;
  pathPrefix?: string;
}>();

const route = useRoute();
const nuxtApp = useNuxtApp();

const { data: schema } = await useAsyncData(
  async () => {
    const result = shallowRef<Schema>({
      type: "page",
    });
    try {
      $loadingBar.start();
      await nuxtApp.callHook(
        "fast-admin:get-amis-options",
        props.name ?? [route.params.key].flat()[0],
        result,
      );
      $loadingBar.finish();
    } catch (error) {
      $loadingBar.error();
      throw error;
    }
    return result.value;
  },
  {
    default() {
      return {
        type: "page",
      };
    },
  },
);
</script>
