<template>
  <div>
    <input v-model="foo" type="text" >
    <input v-model="foo1" type="text" >
    <input v-model="bar" type="text" >
    <input v-model="bar1" type="text" >
    <input v-model="test" type="text" >
    <input v-model="test1" type="text" >
    <input v-model="count" type="number" >
  </div>
</template>

<script setup lang="ts">
const foo = useNuxtStorage("foo", "foo");
const foo1 = useNuxtStorage("foo", "foo");
const bar = useModuleConfig("fastUtils", "test");
const bar1 = useModuleConfig("fastUtils", "test");
const test = useState("test");
const test1 = useState("test");
const { count } = useTestState();
</script>
