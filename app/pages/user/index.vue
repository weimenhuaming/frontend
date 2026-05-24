<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

useSeoMeta({ title: '个人中心' })

const auth = useAuth()
</script>

<template>
  <div class="placeholder-page">
    <h1>个人中心</h1>
    <p class="placeholder-page__lead">功能开发中，敬请期待。</p>

    <div v-if="auth.user" class="placeholder-page__card">
      <dl class="placeholder-page__dl">
        <dt>用户名</dt>
        <dd>{{ auth.user.name }}</dd>
        <dt>邮箱</dt>
        <dd>{{ auth.user.email }}</dd>
        <dt>角色</dt>
        <dd>{{ auth.user.role }}</dd>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.placeholder-page h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.placeholder-page__lead {
  color: var(--color-muted);
  margin-bottom: 1.5rem;
}

.placeholder-page__card {
  padding: 1.25rem 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  max-width: 400px;
}

.placeholder-page__dl {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 0.75rem 1rem;
  font-size: 0.9375rem;
}

.placeholder-page__dl dt {
  color: var(--color-muted);
  font-weight: 500;
}

.placeholder-page__dl dd {
  margin: 0;
  font-weight: 500;
}
</style>
