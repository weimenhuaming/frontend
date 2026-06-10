<script setup lang="ts">
import { deleteArticle, listArticles, type ArticleInfo } from '~/api/article'
import { listCategories } from '~/api/category'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({ title: '博客列表 · Chenaqi Blog' })

const error = ref('')
const actionId = ref<number | null>(null)
const deleteTarget = ref<ArticleInfo | null>(null)
const deleteDialogOpen = computed({
  get: () => deleteTarget.value !== null,
  set: (open: boolean) => {
    if (!open)
      deleteTarget.value = null
  },
})

const { data: categoriesData } = await useAsyncData('admin-categories-map', () => listCategories())
const { data: articlesData, pending, refresh } = await useAsyncData(
  'admin-articles',
  () => listArticles({ page: 1, page_size: 100 }),
)

const articles = computed(() => articlesData.value?.articles ?? [])
const total = computed(() => articlesData.value?.total ?? articles.value.length)

const categoryNameMap = computed(() => {
  const map = new Map<number, string>()
  for (const category of categoriesData.value?.categories ?? [])
    map.set(category.id, category.name)
  return map
})

function onDelete(article: ArticleInfo) {
  deleteTarget.value = article
}

async function confirmDelete() {
  const article = deleteTarget.value
  if (!article)
    return

  error.value = ''
  actionId.value = article.id
  try {
    await deleteArticle(article.id)
    deleteTarget.value = null
    await refresh()
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '删除文章失败'
  }
  finally {
    actionId.value = null
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
        <div class="articles-header__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round" />
          </svg>
        </div>
        <div>
          <h1 class="articles-header__title">
            博客列表
          </h1>
          <p class="articles-header__desc">
            全站已发布文章，可预览或删除
          </p>
        </div>
      </div>

      <div class="articles-header__aside">
        <div v-if="total > 0" class="articles-stats">
          <div class="articles-stat">
            <span class="articles-stat__value">{{ total }}</span>
            <span class="articles-stat__label">文章</span>
          </div>
        </div>
        <NuxtLink to="/admin/article/create" class="admin-btn admin-btn--primary">
          新建文章
        </NuxtLink>
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
          <path d="M10 8h22l6 6v28a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
          <path d="M32 8v6h6M16 22h16M16 30h12" stroke-linecap="round" />
        </svg>
      </div>
      <p class="articles-empty__title">
        暂无文章
      </p>
      <p class="articles-empty__desc">
        点击「新建文章」开始创作
      </p>
      <NuxtLink to="/admin/article/create" class="admin-btn admin-btn--primary" style="margin-top: 1rem">
        新建文章
      </NuxtLink>
    </div>

    <div v-else class="articles-grid">
      <AdminArticleListItem
        v-for="article in articles"
        :key="article.id"
        :article="article"
        :placeholder="categoryNameMap.get(article.category_id)"
      >
        <template #meta>
          <span class="article-meta__accent">{{ categoryNameMap.get(article.category_id) || '未分类' }}</span>
          <span>{{ formatDate(article.created_at) }}</span>
          <span>{{ article.view_count }} 阅读</span>
        </template>
        <template #actions>
          <button
            type="button"
            class="admin-btn admin-btn--danger-ghost"
            :disabled="actionId === article.id"
            @click="onDelete(article)"
          >
            {{ actionId === article.id ? '删除中…' : '删除' }}
          </button>
        </template>
      </AdminArticleListItem>
    </div>

    <ConfirmDialog
      v-model="deleteDialogOpen"
      title="删除文章"
      :message="deleteTarget ? `确定删除文章「${deleteTarget.title}」吗？` : ''"
      confirm-text="删除"
      danger
      :loading="!!deleteTarget && actionId === deleteTarget.id"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.articles-header__aside {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}
</style>
