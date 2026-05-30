<script setup lang="ts">
definePageMeta({ layout: 'home' })

useSeoMeta({ title: '站内助手 · Chenaqi Blog' })
</script>

<template>
  <div class="subpage subpage--article">
    <article class="subpage__article card">
      <div class="subpage__icon" aria-hidden="true">✦</div>
      <h1 class="subpage__title">站内助手</h1>
      <p class="subpage__lead">
        智能助手功能正在开发中，敬请期待。
      </p>
      <p class="subpage__hint">
        后续将支持文章问答、站内搜索与创作辅助等功能。
      </p>
    </article>
  </div>
</template>

<style scoped>
.subpage--article {
  max-width: 42rem;
}

.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.subpage__article {
  padding: 2rem 2.25rem;
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #374151;
  text-align: center;
}

.subpage__icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 1.35rem;
}

.subpage__title {
  margin: 0 0 0.75rem;
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
}

.subpage__lead {
  margin: 0;
  color: #6b7280;
}

.subpage__hint {
  margin: 1rem 0 0;
  font-size: 0.9375rem;
  color: #9ca3af;
}
</style>
