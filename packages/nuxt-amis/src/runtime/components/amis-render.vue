<template>
  <render-react-node :node="jsx" />
</template>

<script lang="ts" setup>
import { computed } from "#imports";
import type { RenderOptions, Schema } from "amis";
import { render } from "amis";
import { RenderReactNode } from "veaury";

defineOptions({
  name: "AmisRender",
});

const props = defineProps<{
  schema: Schema;
  props?: {
    location?: Location;
    theme?: string;
    data?: Record<string, unknown>;
    locale?: string;
    [propName: string]: unknown;
  };
  options?: RenderOptions;
  pathPrefix?: string;
}>();

const jsx = computed(() =>
  render(props.schema, props.props, props.options, props.pathPrefix),
);
</script>
