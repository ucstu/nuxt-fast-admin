<template>
  <amis-editor :value="schema" :on-change="(value) => (schema = value)" />
</template>

<script setup lang="ts">
import type { SchemaObject } from "amis";

const schema = ref<SchemaObject>({
  type: "page",
  title: "Hello, Amis!1111",
  body: "Hello, Amis!",
});

watchEffect(() => {
  console.log(schema.value);
});
</script>

<style lang="css">
html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
}
</style>
