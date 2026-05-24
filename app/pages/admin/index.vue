<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

useSeoMeta({ title: '管理后台' })
</script>

<template>
  <div class="placeholder-page">
    <h1>管理后台</h1>
    <p class="placeholder-page__lead">
      博客管理入口，管理员可在此发布、编辑与删除文章（功能后续补充）。
    </p>
  </div>
</template>

<style scoped>
.placeholder-page h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.placeholder-page__lead {
  color: var(--color-muted);
}
</style>
