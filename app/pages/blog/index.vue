<script setup lang="ts">
import { getArticlesByCategory, listArticles, searchArticles } from '~/api/article'
import { listCategories } from '~/api/category'
import { resolveMediaUrl } from '~/utils/media'

definePageMeta({ layout: 'home' })

useSeoMeta({ title: '近期文章 · Chenaqi Blog' })

const config = useRuntimeConfig()

const PAGE_SIZE = 20

const searchTerm = ref('')
const debouncedSearch = ref('')
const selectedCategoryId = ref<number | 'all'>('all')

let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(searchTerm, (value) => {
  if (searchTimer)
    clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedSearch.value = value
  }, 300)
})

onUnmounted(() => {
  if (searchTimer)
    clearTimeout(searchTimer)
})

const { data: categoriesData } = await useAsyncData('blog-categories', () => listCategories())

const categories = computed(() => categoriesData.value?.categories ?? [])

const categoryNameMap = computed(() => {
  const map = new Map<number, string>()
  for (const category of categories.value)
    map.set(category.id, category.name)
  return map
})

async function fetchArticles() {
  const keyword = debouncedSearch.value.trim()
  const categoryId = selectedCategoryId.value

  if (keyword) {
    return searchArticles({
      keyword,
      page: 1,
      page_size: PAGE_SIZE,
      ...(categoryId !== 'all' ? { category_id: categoryId } : {}),
    })
  }

  if (categoryId !== 'all') {
    return getArticlesByCategory({
      category_id: categoryId,
      page: 1,
      page_size: PAGE_SIZE,
    })
  }

  return listArticles({
    page: 1,
    page_size: PAGE_SIZE,
  })
}

const { data: articlesData, pending, error } = await useAsyncData(
  'blog-articles',
  fetchArticles,
  { watch: [selectedCategoryId, debouncedSearch] },
)

const articles = computed(() => articlesData.value?.articles ?? [])

function formatDate(dateStr: string) {
  return dateStr ? dateStr.slice(0, 10) : ''
}

function getCategoryName(categoryId: number) {
  return categoryNameMap.value.get(categoryId) ?? ''
}

function getCoverUrl(cover: string) {
  return resolveMediaUrl(cover, config.public.apiBase)
}
</script>

<template>
  <div class="subpage">
    <header class="subpage__header">
      <input
        v-model="searchTerm"
        type="search"
        class="subpage__search"
        placeholder="搜索文章..."
      >

      <div class="subpage__tags">
        <button
          type="button"
          class="subpage__tag"
          :class="{ 'subpage__tag--active': selectedCategoryId === 'all' }"
          @click="selectedCategoryId = 'all'"
        >
          全部
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="subpage__tag"
          :class="{ 'subpage__tag--active': selectedCategoryId === category.id }"
          @click="selectedCategoryId = category.id"
        >
          {{ category.name }}
        </button>
      </div>
    </header>

    <p v-if="pending" class="subpage__empty">
      加载中...
    </p>

    <p v-else-if="error" class="subpage__empty">
      {{ error.message || '加载文章失败' }}
    </p>

    <div v-else class="subpage__grid">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/blog/${article.id}`"
        class="subpage__card card"
      >
        <div class="subpage__card-cover-wrap">
          <img
            v-if="getCoverUrl(article.cover)"
            :src="getCoverUrl(article.cover)"
            :alt="`${article.title} 封面`"
            class="subpage__card-cover"
          >
          <div v-else class="subpage__card-cover subpage__card-cover--placeholder">
            <span>{{ getCategoryName(article.category_id) || 'Blog' }}</span>
          </div>
        </div>

        <div class="subpage__card-body">
          <div class="subpage__card-head">
            <div>
              <h2 class="subpage__card-title">{{ article.title }}</h2>
              <p class="subpage__card-date">{{ formatDate(article.created_at) }}</p>
            </div>
          </div>
          <p class="subpage__card-desc">{{ article.summary }}</p>
          <div v-if="getCategoryName(article.category_id)" class="subpage__card-tags">
            <span class="subpage__card-tag">
              {{ getCategoryName(article.category_id) }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <p v-if="!pending && !error && articles.length === 0" class="subpage__empty">
      没有找到相关文章
    </p>
  </div>
</template>

<style scoped>
.subpage {
  margin-top: -1cm;
}

.subpage__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.subpage__search {
  width: min(100%, 28rem);
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 80%);
  background: rgb(255 255 255 / 55%);
  backdrop-filter: blur(12px);
  font-size: 0.95rem;
  outline: none;
  transition: box-shadow 0.15s, border-color 0.15s;
}

.subpage__search:focus {
  border-color: var(--home-accent);
  box-shadow: 0 0 0 3px rgb(20 184 166 / 18%);
}

.subpage__tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.subpage__tag {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: none;
  background: rgb(255 255 255 / 55%);
  color: #4b5563;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.subpage__tag:hover {
  background: rgb(255 255 255 / 80%);
}

.subpage__tag--active {
  background: var(--home-accent);
  color: #fff;
}

.subpage__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.subpage__card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.subpage__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px var(--home-shadow);
}

.subpage__card-cover-wrap {
  width: 100%;
}

.subpage__card-cover {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.subpage__card-cover--placeholder {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--home-accent-pale), rgb(255 255 255 / 70%));
  color: var(--home-accent-dark);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.subpage__card-body {
  padding: 1.1rem 1.15rem;
}

.subpage__card-head {
  margin-bottom: 0.75rem;
}

.subpage__card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.subpage__card-date {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
}

.subpage__card-desc {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: #6b7280;
}

.subpage__card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.85rem;
}

.subpage__card-tag {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 0.7rem;
  font-weight: 600;
}

.subpage__empty {
  margin-top: 2rem;
  text-align: center;
  color: #9ca3af;
}
</style>
