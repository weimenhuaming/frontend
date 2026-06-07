<script setup lang="ts">
import type { ArticleInfo } from '~/api/article'
import { resolveMediaUrl } from '~/utils/media'

const props = defineProps<{
  article: ArticleInfo
  placeholder?: string
}>()

const config = useRuntimeConfig()

const coverUrl = computed(() =>
  resolveMediaUrl(props.article.cover, config.public.apiBase),
)

const articleLink = computed(() => `/blog/${props.article.id}`)

const categoryLabel = computed(() =>
  (props.placeholder || '未分类').slice(0, 8),
)
</script>

<template>
  <article class="article-card card">
    <NuxtLink
      :to="articleLink"
      class="article-card__cover"
      :aria-label="`${article.title} 封面`"
    >
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="article.title"
        class="article-card__cover-img"
      >
      <div v-else class="article-card__cover-fallback">
        {{ categoryLabel }}
      </div>
    </NuxtLink>

    <div class="article-card__body">
      <NuxtLink :to="articleLink" class="article-card__title">
        {{ article.title }}
      </NuxtLink>
      <p v-if="article.summary" class="article-card__summary">
        {{ article.summary }}
      </p>
      <div class="article-card__meta">
        <slot name="meta" />
      </div>
    </div>

    <div class="article-card__actions">
      <NuxtLink :to="articleLink" class="admin-btn admin-btn--ghost">
        预览
      </NuxtLink>
      <slot name="actions" />
    </div>
  </article>
</template>

<style scoped>
.article-card {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.15rem;
  transition: box-shadow 0.2s, transform 0.15s;
}

.article-card:hover {
  box-shadow: 0 8px 28px rgb(20 184 166 / 12%);
  transform: translateY(-1px);
}

.article-card__cover {
  flex-shrink: 0;
  display: block;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
}

.article-card__cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-card__cover-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: 0.35rem;
  background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
  color: #0d9488;
  font-size: 0.6875rem;
  font-weight: 800;
  text-align: center;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.article-card__body {
  min-width: 0;
}

.article-card__title {
  display: block;
  font-size: 0.975rem;
  font-weight: 700;
  color: #111827;
  text-decoration: none;
  line-height: 1.4;
  transition: color 0.15s;
}

.article-card__title:hover {
  color: #0d9488;
}

.article-card__summary {
  margin: 0.3rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #9ca3af;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.55rem;
}

.article-card__meta :deep(span) {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: #f3f4f6;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
}

.article-card__meta :deep(.article-meta__accent) {
  background: rgb(20 184 166 / 10%);
  color: #0f766e;
}

.article-card__meta :deep(.article-meta__likes) {
  background: #fef2f2;
  color: #ef4444;
}

.article-card__meta :deep(.article-meta__likes svg) {
  width: 0.7rem;
  height: 0.7rem;
}

.article-card__actions {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex-shrink: 0;
}

@media (max-width: 720px) {
  .article-card {
    grid-template-columns: 4.5rem minmax(0, 1fr);
    grid-template-rows: auto auto;
  }

  .article-card__actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
