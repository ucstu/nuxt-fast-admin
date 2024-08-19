<template>
  <fa-pages-crud :api="nuxtApp.$fims" resource="Page" />
</template>

<script setup lang="ts">
import type { FaPagesCrud } from "#components";

const nuxtApp = useNuxtApp();
</script>
