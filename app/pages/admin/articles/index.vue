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

const { data: categoriesData } = await useAsyncData('admin-categories-map', () => listCategories())
const { data: articlesData, refresh } = await useAsyncData(
  'admin-articles',
  () => listArticles({ page: 1, page_size: 100 }),
)

const articles = computed(() => articlesData.value?.articles ?? [])

const categoryNameMap = computed(() => {
  const map = new Map<number, string>()
  for (const category of categoriesData.value?.categories ?? [])
    map.set(category.id, category.name)
  return map
})

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
    <header class="admin-view__header admin-view__header--row">
      <div>
        <h1 class="admin-view__title">
          博客列表
        </h1>
        <p class="admin-view__desc">
          查看已发布文章，可预览或删除。
        </p>
      </div>
      <NuxtLink to="/admin/article/create" class="admin-view__action">
        新建文章
      </NuxtLink>
    </header>

    <section class="admin-panel card">
      <p v-if="error" class="admin-panel__error">
        {{ error }}
      </p>

      <ul v-if="articles.length" class="admin-list admin-list--articles">
        <AdminArticleListItem
          v-for="article in articles"
          :key="article.id"
          :article="article"
          :placeholder="categoryNameMap.get(article.category_id)"
        >
          <template #meta>
            <span>{{ categoryNameMap.get(article.category_id) || '未分类' }}</span>
            <span>{{ formatDate(article.created_at) }}</span>
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
        暂无文章，点击「新建文章」开始创作
      </p>
    </section>
  </div>
</template>
