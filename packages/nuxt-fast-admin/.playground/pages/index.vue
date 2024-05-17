<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>

<script setup lang="ts">
definePageMeta({
  title: "index",
});

const { crudRef, crudBinding } = useFaCrud("petstore3", {
  request: {
    async pageRequest(query, fetch) {
      return fetch("/pet/findByStatus", {
        method: "GET",
        query: {
          status: "available",
        },
      });
    },
  },
  columns: {
    id: {
      title: "ID",
      type: "number",
    },
    name: {
      title: "Name",
      type: "text",
    },
  },
});
</script>
