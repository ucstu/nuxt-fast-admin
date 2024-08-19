<template>
  <amis-render :schema="schema" />
</template>

<script lang="ts" setup>
import { shallowRef, useAsyncData, useNuxtApp, useRoute } from "#imports";
import type { Schema } from "@ucstu/nuxt-amis/exports";

defineOptions({
  name: "FaPagesAmis",
});

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
        [route.params.key].flat()[0],
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
