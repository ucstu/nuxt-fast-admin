<template>
  <amis-render :schema="schema" />
</template>

<script lang="ts" setup>
import { ref, useRoute } from "#imports";
import type { Schema } from "@ucstu/nuxt-amis/exports";

defineOptions({
  name: "FaPagesAmis",
});

const route = useRoute();

console.log(route.params.key);

const schema = ref<Schema>({
  type: "page",
  title: "Hello, Amis!",
  body: "This is a Amis page.",
});
</script>
