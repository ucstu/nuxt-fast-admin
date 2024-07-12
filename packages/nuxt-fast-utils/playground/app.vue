<template>
  <div>
    <input v-model="foo" type="text" >
    <input v-model="foo1" type="text" >
    <input v-model="test" type="text" >
    <input v-model="test1" type="text" >
    <input v-model="config.bar" type="text" >
    <input v-model="bar" type="text" >
    <input v-model="bar1" type="text" >
    <input v-model="count" type="number" >
  </div>
</template>

<script setup lang="ts">
const foo = useNuxtStorage("foo", "foo");
const foo1 = useNuxtStorage("foo", "foo");
const bar = useNuxtConfig("bar");
const bar1 = useNuxtConfig("bar");
const test = useState("test");
const test1 = useState("test");
const config = useNuxtConfig();
const { count } = useTestState();
</script>
