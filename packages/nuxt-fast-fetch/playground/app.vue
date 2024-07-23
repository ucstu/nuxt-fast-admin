<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
const result = await $petStore.findPetsByStatus({
  query: {
    status: "available",
  },
});
console.log(result.data);
</script>
