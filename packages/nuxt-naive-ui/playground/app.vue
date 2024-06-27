<template>
  <n-config-provider v-bind="naiveUiThemeConfig">
    Nuxt module playground!
    <n-button @click="changeTheme">Default</n-button>
  </n-config-provider>
</template>

<script lang="ts">
const thems = ["light", "dark", "auto"];
</script>

<script setup lang="ts">
const { store: naiveUiTheme } = useNaiveUiTheme();
const naiveUiThemeConfig = useNaiveUiThemeConfig();

function changeTheme() {
  naiveUiTheme.value = thems[(thems.indexOf(naiveUiTheme.value) + 1) % 3];
}
</script>
