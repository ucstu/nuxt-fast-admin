<template>
  <div>
    admin
    <nuxt-link to="/"> to home </nuxt-link>
    <nuxt-link to="/user"> to user </nuxt-link>
    <nuxt-link to="/auth"> to auth </nuxt-link>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: "admin",
});
</script>
