<template>
  <div>
    user
    <nuxt-link to="/"> to home </nuxt-link>
    <nuxt-link to="/admin"> to admin </nuxt-link>
    <nuxt-link to="/auth"> to auth </nuxt-link>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: "user",
});
</script>
