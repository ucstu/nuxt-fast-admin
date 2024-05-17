<template>
  <n-config-provider
    :theme="naiveTheme.theme.value"
    :theme-overrides="naiveTheme.themeOverrides.value"
  >
    Nuxt module playground!
    <n-button @click="changeTheme">Default</n-button>
  </n-config-provider>
</template>

<script setup lang="ts">
const naiveTheme = useNiaveUiTheme();

function changeTheme() {
  naiveTheme.current.value =
    naiveTheme.theme.value?.name === "light" ? "dark" : "light";
}
</script>
