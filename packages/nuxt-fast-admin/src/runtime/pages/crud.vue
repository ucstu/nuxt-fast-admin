<template>
  <fa-crud :options="options" />
</template>

<script lang="ts" setup>
import type * as apis from "#fast-fetch";
import { useAdminCrud, useRoute } from "#imports";

const route = useRoute();

const options = useAdminCrud(
  () => `$${[route.params.api].flat()[0]}` as keyof typeof apis,
  () => `$${[route.params.name].flat()[0]}` as `$${string}`,
);
</script>
