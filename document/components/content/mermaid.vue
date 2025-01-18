<template>
  <pre v-if="show" class="mermaid">
    <ContentSlot :use="$slots.default" unwrap="p" />
  </pre>
</template>

<script lang="ts" setup>
const show = ref(false);

const { $mermaid } = useNuxtApp();

onMounted(async () => {
  show.value = true;
  $mermaid.initialize({ startOnLoad: true });
  await nextTick();
  $mermaid.init();
});

onUpdated(async () => {
  await nextTick();
  $mermaid.init();
});
</script>
