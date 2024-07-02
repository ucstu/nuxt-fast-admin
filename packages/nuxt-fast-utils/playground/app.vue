<template>
  <div>
    <input v-model="foo" type="text" />
    <input v-model="foo1" type="text" />
    <input v-model="test" type="text" />
    <input v-model="test1" type="text" />
  </div>
</template>

<script setup lang="ts">
const foo = useStorage("foo", "foo");
const foo1 = useStorage("foo", "foo");
const test = useState("test");
const test1 = useState("test");
hookExist();
</script>
