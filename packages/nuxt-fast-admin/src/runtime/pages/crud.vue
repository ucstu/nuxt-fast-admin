<template>
  <fa-crud :options="options" />
</template>

<script lang="ts" setup>
import * as apis from "#fast-fetch";
import { computed, useAdminCrud, useRoute } from "#imports";

const route = useRoute();

const api = computed(
  () => `$${[route.params.api].flat()[0]}` as keyof typeof apis,
);
const name = computed(
  () => `$${[route.params.name].flat()[0]}` as `$${string}`,
);

const options = useAdminCrud(() => apis[api.value], name);
</script>
