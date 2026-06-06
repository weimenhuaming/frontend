<script setup lang="ts">
import { deleteArticle } from '~/api/article'
import { listCategories } from '~/api/category'
import { listMyArticles } from '~/api/user'
import type { ArticleInfo } from '~/api/article'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({ title: '我的博客 · Chenaqi Blog' })

const page = ref(1)
const pageSize = 10
const error = ref('')
const actionId = ref<number | null>(null)

const { data: categoriesData } = await useAsyncData('admin-my-categories', () => listCategories())

const { data, pending, refresh } = await useAsyncData(
  () => `admin-my-articles-${page.value}`,
  () => listMyArticles({ page: page.value, page_size: pageSize }),
  { watch: [page] },
)

const articles = computed(() => data.value?.articles ?? [])
const total = computed(() => data.value?.total ?? 0)

const categoryNameMap = computed(() => {
  const map = new Map<number, string>()
  for (const category of categoriesData.value?.categories ?? [])
    map.set(category.id, category.name)
  return map
})

async function loadPage(next: number) {
  if (next < 1)
    return
  page.value = next
  await refresh()
}

async function onDelete(article: ArticleInfo) {
  if (!confirm(`确定删除文章「${article.title}」吗？`))
    return

  error.value = ''
  actionId.value = article.id
  try {
    await deleteArticle(article.id)
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
  <div class="admin-view">
    <header class="admin-view__header">
      <h1 class="admin-view__title">
        我的博客
      </h1>
      <p class="admin-view__desc">
        你发布的文章，共 {{ total }} 篇。
      </p>
    </header>

    <section class="admin-panel card">
      <div class="admin-panel__toolbar">
        <NuxtLink to="/admin/article/create" class="admin-view__action">
          新建文章
        </NuxtLink>
      </div>

      <p v-if="error" class="admin-panel__error">{{ error }}</p>
      <p v-else-if="pending" class="admin-panel__empty">加载中…</p>

      <ul v-else-if="articles.length" class="admin-list admin-list--articles">
        <AdminArticleListItem
          v-for="article in articles"
          :key="article.id"
          :article="article"
          :placeholder="categoryNameMap.get(article.category_id)"
        >
          <template #meta>
            <span>{{ categoryNameMap.get(article.category_id) || '未分类' }}</span>
            <span>{{ formatDate(article.created_at) }}</span>
            <span>{{ article.view_count }} 阅读</span>
          </template>
          <template #actions>
            <button
              type="button"
              class="admin-panel__btn admin-panel__btn--danger"
              :disabled="actionId === article.id"
              @click="onDelete(article)"
            >
              {{ actionId === article.id ? '删除中...' : '删除' }}
            </button>
          </template>
        </AdminArticleListItem>
      </ul>
      <p v-else class="admin-panel__empty">
        还没有发布文章
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
        <span>{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
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
.admin-panel__toolbar {
  margin-bottom: 1rem;
}

.admin-panel__pager {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
