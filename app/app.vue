<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :key="route.path" />
    </NuxtLayout>
  </div>
</template>
