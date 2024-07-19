<template>
  <fa-crud :options="options" />
</template>

<script setup lang="ts">
const options = useAdminCrud($petStore, "$Pet", {
  columns: {
    tags: {
      type: "text",
      title: "Tags",
    },
  },
});
</script>
