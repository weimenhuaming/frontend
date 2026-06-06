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

async function loadPage(next: number) {
  if (next < 1)
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
  <div class="admin-view">
    <header class="admin-view__header">
      <h1 class="admin-view__title">
        点赞列表
      </h1>
      <p class="admin-view__desc">
        你点赞过的文章，共 {{ total }} 篇。
      </p>
    </header>

    <section class="admin-panel card">
      <p v-if="error" class="admin-panel__error">{{ error }}</p>
      <p v-else-if="pending" class="admin-panel__empty">加载中…</p>

      <ul v-else-if="articles.length" class="admin-list admin-list--articles">
        <AdminArticleListItem
          v-for="article in articles"
          :key="article.id"
          :article="article"
        >
          <template #meta>
            <span>{{ article.author_name }}</span>
            <span>{{ formatDate(article.created_at) }}</span>
            <span class="admin-list__like-stat">
              <svg class="admin-list__like-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {{ article.like_count }}
            </span>
          </template>
        </AdminArticleListItem>
      </ul>
      <p v-else class="admin-panel__empty">
        还没有点赞任何文章
      </p>

      <div v-if="total > pageSize" class="admin-panel__pager">
        <button
          type="button"
          class="admin-panel__btn"
          :disabled="page <= 1 || pending"
          @click="loadPage(page - 1)"
        >
          上一页
        </button>
        <span class="admin-panel__pager-info">{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
        <button
          type="button"
          class="admin-panel__btn"
          :disabled="page * pageSize >= total || pending"
          @click="loadPage(page + 1)"
        >
          下一页
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.admin-panel__pager {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.admin-panel__pager-info {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
