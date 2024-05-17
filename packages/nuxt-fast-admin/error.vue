<template>
  <fa-pages-error :error="error" @clear-error="clearError" />
</template>

<script setup lang="ts">
import type { FaPagesError } from "#components";

defineProps<{
  error: InstanceType<typeof FaPagesError>["$props"]["error"];
}>();
</script>
