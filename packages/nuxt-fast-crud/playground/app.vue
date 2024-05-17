<template>
  <div style="position: relative; height: 100vh">
    <fs-page>
      <fs-crud ref="crudRef" v-bind="crudBinding">
        <fs-button @click="crudExpose.doRefresh"> Refresh </fs-button>
      </fs-crud>
    </fs-page>
  </div>
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

const { crudRef, crudBinding, crudExpose } = useFs<Pet>({
  createCrudOptions() {
    return {
      crudOptions: {
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
      },
    };
  },
});
</script>
