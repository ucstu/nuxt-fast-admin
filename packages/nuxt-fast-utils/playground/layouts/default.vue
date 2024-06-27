<template>
  <div>
    {{ route.meta }}
    <slot />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
