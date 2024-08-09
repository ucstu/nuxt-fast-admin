<template>
  <fc-crud :options="options">
    <template #header> header </template>
    <template #footer> footer </template>
  </fc-crud>
</template>

<script setup lang="ts">
interface Pet {
  id: number;
  category?: Category;
  name: string;
  photoUrls: string[];
  tags: Tag[];
  status: string;
}

interface Category {
  id: number;
  name?: string;
}

interface Tag {
  id: number;
  name?: string;
}

const options = defineCrudOptions({
  request: {
    async pageRequest() {
      const data = await fetch(
        "https://petstore.swagger.io/v2/pet/findByStatus?status=available&status=pending&status=sold",
      ).then<Array<Pet>>((response) => response.json());
      return {
        records: data,
        total: data.length,
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
      render({ value }) {
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
      render({ value }) {
        return h("div", value.map((tag) => tag.name).join(", "));
      },
    },
    status: {
      title: "Status",
      width: "100px",
    },
  },
});
</script>
