<template>
  <n-icon v-bind="$props" class="fa-icon">
    <Icon :name="name" />
  </n-icon>
</template>

<script lang="ts">
import { computed, useNuxtApp } from "#imports";
import iconifyCollections from "@iconify/collections/collections.json";
</script>

<script setup lang="ts">
import { iconProps } from "naive-ui";

function resolveIconName(name = "") {
  let prefix;
  let provider = "";
  if (name[0] === "@" && name.includes(":")) {
    provider = name.split(":")[0].slice(1);
    name = name.split(":").slice(1).join(":");
  }
  if (name.startsWith("i-")) {
    name = name.replace(/^i-/, "");
    for (const collectionName of Object.keys(iconifyCollections)) {
      if (name.startsWith(collectionName)) {
        prefix = collectionName;
        name = name.slice(collectionName.length + 1);
        break;
      }
    }
  } else if (name.includes(":")) {
    const [_prefix, _name] = name.split(":");
    prefix = _prefix;
    name = _name;
  }
  return {
    provider,
    prefix: prefix || "",
    name: name || "",
  };
}

function pascalCase(str: string) {
  return str.replace(/(^\w|-\w)/g, (m) => m[m.length - 1].toUpperCase());
}

const props = defineProps({
  ...iconProps,
  name: {
    type: String,
    required: true,
  },
});

const nuxtApp = useNuxtApp();
const resolvedIcon = computed(() => resolveIconName(props.name));
const iconComponentName = computed(() =>
  pascalCase(`icons-${resolvedIcon.value.prefix}-${resolvedIcon.value.name}`),
);
const name = computed(() =>
  nuxtApp.vueApp?.component(iconComponentName.value)
    ? iconComponentName.value
    : props.name,
);
</script>

<style>
.fa-icon {
  display: inline-flex;
}
</style>
