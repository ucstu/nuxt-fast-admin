<template>
  <render-react-node :node="jsx" />
</template>

<script lang="ts" setup>
import { computed } from "#imports";
import type { Schema } from "amis";
import { render } from "amis";
import { RenderReactNode } from "veaury";

defineOptions({
  name: "AmisRender",
});

const props = defineProps<{
  schema: Schema;
}>();

const jsx = computed(() => render(props.schema));
</script>
