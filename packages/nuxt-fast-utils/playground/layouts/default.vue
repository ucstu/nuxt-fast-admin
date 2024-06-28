<template>
  <div>
    {{ meta }}
    <slot />
  </div>
</template>

<script setup lang="ts">
const meta = useRouteMeta();
</script>
