<template>
  <n-config-provider v-bind="defu(naiveUiTheme, naiveUiI18n)">
    Nuxt module playground!
    <n-button @click="changeTheme">Default</n-button>
  </n-config-provider>
</template>

<script lang="ts"></script>

<script setup lang="ts">
import defu from "defu";
const thems = ["light", "dark", "auto"];

const naiveUiI18n = useNaiveUiI18n();
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
