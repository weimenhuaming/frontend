<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'dashboard',
})

await navigateTo('/admin/profile', { replace: true })
</script>
