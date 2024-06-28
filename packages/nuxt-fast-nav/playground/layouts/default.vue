<template>
  <div>
    <div style="border: 1px solid blue">
      <div v-for="history in histories" :key="history.path">
      <nuxt-link :to="history.path" :style="history === current ? 'color: red' : ''">{{ history.meta.title }}</nuxt-link>
    </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const { menus, histories } = useNav();
const current = histories.current;
</script>
