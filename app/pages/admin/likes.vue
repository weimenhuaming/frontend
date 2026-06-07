<script setup lang="ts">
import { listUserLikedArticles } from '~/api/user'

definePageMeta({
  layout: 'admin',
  middleware: 'dashboard',
})

useSeoMeta({ title: '点赞列表 · Chenaqi Blog' })

const page = ref(1)
const pageSize = 10
const error = ref('')

const { data, pending, refresh } = await useAsyncData(
  () => `admin-liked-articles-${page.value}`,
  () => listUserLikedArticles({ page: page.value, page_size: pageSize }),
  { watch: [page] },
)

const articles = computed(() => data.value?.articles ?? [])
const total = computed(() => data.value?.total ?? 0)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

async function loadPage(next: number) {
  if (next < 1 || next > totalPages.value)
    return
  page.value = next
  error.value = ''
  try {
    await refresh()
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '加载失败'
  }
}

function formatDate(dateStr: string) {
  return dateStr ? dateStr.slice(0, 10) : ''
}
</script>

<template>
  <div class="articles-page">
    <header class="articles-header">
      <div class="articles-header__main">
        <div class="articles-header__icon articles-header__icon--likes" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div>
          <h1 class="articles-header__title">
            点赞列表
          </h1>
          <p class="articles-header__desc">
            你点赞过的文章，共 {{ total }} 篇
          </p>
        </div>
      </div>

      <div v-if="total > 0" class="articles-stats">
        <div class="articles-stat">
          <span class="articles-stat__value">{{ total }}</span>
          <span class="articles-stat__label">篇</span>
        </div>
      </div>
    </header>

    <div v-if="error" class="articles-alert" role="alert">
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </div>

    <div v-if="pending" class="articles-empty card">
      <div class="articles-empty__spinner" />
      <p>加载中…</p>
    </div>

    <div v-else-if="!articles.length" class="articles-empty card">
      <div class="articles-empty__icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M24 38s-10-7.2-14-14.4C7.6 18 10.4 12 16 12c3.2 0 5.6 1.6 8 4 2.4-2.4 4.8-4 8-4 5.6 0 8.4 6 6 11.6C34 30.8 24 38 24 38z" stroke-linejoin="round" />
        </svg>
      </div>
      <p class="articles-empty__title">
        还没有点赞任何文章
      </p>
      <p class="articles-empty__desc">
        去博客逛逛，给喜欢的文章点个赞吧
      </p>
      <NuxtLink to="/blog" class="admin-btn admin-btn--primary" style="margin-top: 1rem">
        浏览博客
      </NuxtLink>
    </div>

    <div v-else class="articles-grid">
      <AdminArticleListItem
        v-for="article in articles"
        :key="article.id"
        :article="article"
      >
        <template #meta>
          <span class="article-meta__accent">{{ article.author_name }}</span>
          <span>{{ formatDate(article.created_at) }}</span>
          <span class="article-meta__likes">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {{ article.like_count }}
          </span>
        </template>
      </AdminArticleListItem>
    </div>

    <div v-if="total > pageSize && !pending" class="articles-pager card">
      <button
        type="button"
        class="admin-btn admin-btn--ghost"
        :disabled="page <= 1"
        @click="loadPage(page - 1)"
      >
        上一页
      </button>
      <span class="articles-pager__info">{{ page }} / {{ totalPages }}</span>
      <button
        type="button"
        class="admin-btn admin-btn--ghost"
        :disabled="page >= totalPages"
        @click="loadPage(page + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped>
.articles-header__icon--likes {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #ef4444;
}

.articles-page :deep(.articles-stat__value) {
  color: #ef4444;
}

.articles-pager.card {
  padding: 0.85rem 1.25rem;
}
</style>
