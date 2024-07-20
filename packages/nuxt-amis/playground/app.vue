<template>
  <amis-editor :value="schema" @change="(value) => (schema = value)" />
  <button style="position: fixed; bottom: 0; right: 0" @click="open = true">
    预览
  </button>
  <dialog
    :open="open"
    style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
    "
  >
    <form method="dialog" @submit="open = false">
      <amis-render :schema="schema" />
      <div class="right">
        <input class="btn" type="submit" value="Ok" >
        <input class="btn" type="submit" value="Cancel" >
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import type { SchemaObject } from "amis";

const schema = ref<SchemaObject>({
  type: "page",
  title: "Hello Amis",
  body: "Hello Amis",
});

const open = ref(true);
</script>

<style lang="css">
html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
}
</style>
