<template>
  <fc-crud :options="options" />
</template>

<script setup lang="ts">
const options = defineCrudOptions({
  request: {
    async pageRequest() {
      return await $petStore.findPetsByStatus({
        status: "available1",
      });
    },
    transformRes({ res }) {
      return {
        currentPage: 1,
        pageSize: 10,
        records: res.data ?? [],
        total: res.data?.length ?? 0,
      };
    },
  },
  columns: {
    id: {
      title: "ID",
    },
    name: {
      title: "Name",
    },
    status: {
      title: "Status",
    },
  },
});
</script>
