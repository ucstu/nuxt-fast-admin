<template>
  <n-config-provider v-bind="naiveUiTheme">
    Nuxt module playground!
    <n-button @click="changeTheme">Default</n-button>
  </n-config-provider>
</template>

<script lang="ts">
const thems = ["light", "dark", "auto"];
</script>

<script setup lang="ts">
const naiveUiTheme = useNaiveUiTheme();

function changeTheme() {
  naiveUiTheme.store = thems[(thems.indexOf(naiveUiTheme.store) + 1) % 3];
}
</script>

<style>
html.dark {
  background: #111;
  color-scheme: dark;
}
</style>
