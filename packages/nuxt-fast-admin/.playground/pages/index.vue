<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>

<script setup lang="ts">
definePageMeta({
  title: "index",
});

const { $petstore3 } = useNuxtApp();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions() {
    return {
      crudOptions: {
        request: {
          async pageRequest() {
            return $petstore3("/pet/findByStatus", {
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
      },
    };
  },
});

crudExpose.doRefresh();
</script>
