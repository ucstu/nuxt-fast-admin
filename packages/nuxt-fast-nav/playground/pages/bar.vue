<template>
  <div>current: {{ current }}</div>
  <button @click="close()">close current</button>
  <button @click="closeAll()">close all</button>
  <button @click="closeOthers()">close others</button>
  <div v-for="history in histories">
    <nuxt-link :to="history.to">{{ history.title }}</nuxt-link>
    <button @click="close(history)">close</button>
  </div>
</template>

<script setup lang="ts">
const histories = useNavHistories();
const { current, close, closeAll, closeOthers, open } = histories;
</script>
