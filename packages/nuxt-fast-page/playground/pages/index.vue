<template>
  <div>
    Nuxt module playground!
    {{ routeMeta }}
  </div>
</template>

<script setup lang="ts">
const routeMeta = useRouteMeta();
</script>
