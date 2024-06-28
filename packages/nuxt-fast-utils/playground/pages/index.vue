<template>
  <div>
    <input v-model="foo" type="text" />
    <input v-model="foo1" type="text" />
    <input v-model="bar" type="text" />
    <input v-model="bar1" type="text" />
    <input v-model="test" type="text" />
    <input v-model="test1" type="text" />
    <input v-model="meta.title" type="text" />
  </div>
  <div style="display: flex; gap: 10px">
    <nuxt-link href="/test1">test1</nuxt-link>
    <nuxt-link href="/test2">test2</nuxt-link>
  </div>
</template>

<script setup lang="ts">
const foo = useStorage("foo", "foo");
const foo1 = useStorage("foo", "foo");
const bar = refAppConfig("fastUtils.bar");
const bar1 = refAppConfig("fastUtils.bar", "bar");
const test = useState("test");
const test1 = useState("test");
const meta = useRouteMeta();
</script>
