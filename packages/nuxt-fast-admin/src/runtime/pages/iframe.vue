<template>
  <fa-pages-iframe />
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, onBeforeUnmount } from "#imports";

defineOptions({
  name: "FaPagesIframe",
});

const instance = getCurrentInstance();
onMounted(() => {
  let old = "";
  if (instance?.proxy?.$el?.parentElement) {
    old = instance.proxy.$el.parentElement.style.fontSize;
    instance.proxy.$el.parentElement.style.fontSize = "0";
  }
  onBeforeUnmount(() => {
    if (instance?.proxy?.$el?.parentElement) {
      instance.proxy.$el.parentElement.style.fontSize = old;
    }
  });
});
</script>
