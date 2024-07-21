<template>
  <amis-render :schema="schema" />
</template>

<script lang="ts" setup>
import { shallowRef, useNuxtApp, useRoute } from "#imports";
import type { Schema } from "@ucstu/nuxt-amis/exports";
import { useAsyncState } from "@ucstu/nuxt-fast-utils/exports";

defineOptions({
  name: "FaPagesAmis",
});

const route = useRoute();
const nuxtApp = useNuxtApp();

const { state: schema } = useAsyncState(
  async () => {
    const result = shallowRef<Schema>({
      type: "page",
    });
    try {
      $loadingBar.start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    type: "page",
  },
);
</script>
