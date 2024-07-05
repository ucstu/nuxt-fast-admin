<script setup lang="ts">
const route = useRoute();

definePageMeta({
  menu: {
    parent: "$root",
  },
});
</script>

<template>
  <div>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.params }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank"
      >Learn more about Nuxt Routing</a
    >
  </div>
</template>
