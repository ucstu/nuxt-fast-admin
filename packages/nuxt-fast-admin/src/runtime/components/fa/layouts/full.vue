<template>
  <div class="fast-admin-layout-full">
    <suspense>
      <slot />
    </suspense>
    <n-back-top />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "FaLayoutesFull",
});
</script>

<style>
.fast-admin-layout-full {
  height: 100%;
}
</style>
