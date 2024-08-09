<template>
  <fa-error v-bind="props" @clear-error="clearError" />
</template>

<script setup lang="ts">
import { clearError } from "#imports";
import type { NuxtError } from "#app";

const props = defineProps<{
  /**
   * 错误信息
   */
  error: NuxtError | Error;
}>();
</script>
