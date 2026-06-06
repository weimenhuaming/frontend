<script setup lang="ts">
const route = useRoute()
const auth = useAuth()

onMounted(() => {
  auth.hydrate()
  void auth.syncProfile()
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :key="route.path" />
    </NuxtLayout>
  </div>
</template>
