<template>
  <fa-crud :options="options" />
</template>

<script setup lang="ts">
const options = useAdminCrud($petStore, "$Pet", {
  request: {
    async pageRequest() {
      return await $petStore.findPetsByStatus({
        query: {
          status: "available",
        },
      });
    },
    transformRes({ res }) {
      console.log(res);

      return {
        currentPage: 1,
        pageSize: 10,
        records: res.data,
        total: res.data.length,
      };
    },
  },
  columns: {
    id: {
      title: "ID",
      width: "50px",
    },
    name: {
      title: "Name",
      width: "200px",
    },
    photoUrls: {
      title: "Photo",
      width: "200px",
      render({ value }: any) {
        return h("img", {
          attrs: {
            src: value[0],
            width: "50px",
            height: "50px",
          },
        });
      },
    },
    tags: {
      title: "Tags",
      width: "200px",
      render({ value }: any) {
        return h("div", value.map((tag: any) => tag.name).join(", "));
      },
    },
    status: {
      title: "Status",
      width: "100px",
    },
  },
});
</script>
