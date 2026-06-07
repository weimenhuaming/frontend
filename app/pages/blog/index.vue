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

function formatYear(dateStr: string) {
  return dateStr ? dateStr.slice(0, 4) : ''
}

function formatDate(dateStr: string) {
  return dateStr ? dateStr.slice(0, 10) : ''
}

function getCategoryName(categoryId: number) {
  return categoryNameMap.value.get(categoryId) ?? ''
}

function getCoverUrl(cover: string) {
  return resolveMediaUrl(cover, config.public.apiBase)
}

function getThumbLabel(article: { title: string, category_id: number }) {
  const category = getCategoryName(article.category_id)
  if (category)
    return category.slice(0, 2).toUpperCase()
  return article.title.slice(0, 1).toUpperCase() || 'B'
}
</script>

<template>
  <div class="blog-page">
    <header class="blog-page__header">
      <label class="blog-page__search card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          v-model="searchTerm"
          type="search"
          placeholder="搜索文章..."
        >
      </label>

      <div class="blog-page__filters">
        <button
          type="button"
          class="blog-page__filter"
          :class="{ 'blog-page__filter--active': selectedCategoryId === 'all' }"
          @click="selectedCategoryId = 'all'"
        >
          全部
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="blog-page__filter"
          :class="{ 'blog-page__filter--active': selectedCategoryId === category.id }"
          @click="selectedCategoryId = category.id"
        >
          {{ category.name }}
        </button>
      </div>
    </header>

    <p v-if="pending" class="blog-page__empty">
      加载中...
    </p>

    <p v-else-if="error" class="blog-page__empty">
      {{ error.message || '加载文章失败' }}
    </p>

    <div v-else class="blog-page__grid">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/blog/${article.id}`"
        class="blog-card card"
      >
        <div class="blog-card__head">
          <div class="blog-card__thumb">
            <img
              v-if="getCoverUrl(article.cover)"
              :src="getCoverUrl(article.cover)"
              :alt="`${article.title} 封面`"
              class="blog-card__thumb-img"
              loading="lazy"
            >
            <span v-else class="blog-card__thumb-fallback">
              {{ getThumbLabel(article) }}
            </span>
          </div>

          <div class="blog-card__meta">
            <div class="blog-card__title-row">
              <h2 class="blog-card__title">{{ article.title }}</h2>
              <span class="blog-card__year">{{ formatYear(article.created_at) }}</span>
            </div>
            <p class="blog-card__sub">
              {{ formatDate(article.created_at) }}
              <template v-if="article.author_name">
                · {{ article.author_name }}
              </template>
            </p>
          </div>
        </div>

        <div v-if="getCategoryName(article.category_id)" class="blog-card__tags">
          <span class="blog-card__tag">{{ getCategoryName(article.category_id) }}</span>
        </div>

        <p class="blog-card__desc">
          {{ article.summary || '暂无摘要' }}
        </p>

        <div class="blog-card__stats">
          <span class="blog-card__stat" title="阅读">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {{ article.view_count }}
          </span>
          <span class="blog-card__stat" title="点赞">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {{ article.like_count }}
          </span>
          <span class="blog-card__stat" title="评论">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
            {{ article.comment_count }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <p v-if="!pending && !error && articles.length === 0" class="blog-page__empty">
      没有找到相关文章
    </p>
  </div>
</template>

<style scoped>
.blog-page {
  margin-top: -1cm;
}

.blog-page__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid #eef2f6;
  box-shadow: 0 4px 20px rgb(15 23 42 / 5%);
}

.blog-page__search {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: min(100%, 30rem);
  padding: 0.8rem 1.1rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.blog-page__search:focus-within {
  border-color: var(--home-accent-light);
  box-shadow: 0 4px 20px rgb(20 184 166 / 10%);
}

.blog-page__search svg {
  width: 1.05rem;
  height: 1.05rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.blog-page__search input {
  flex: 1;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 0.9375rem;
  color: #111827;
  outline: none;
}

.blog-page__search input::placeholder {
  color: #9ca3af;
}

.blog-page__filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.45rem;
}

.blog-page__filter {
  padding: 0.4rem 0.9rem;
  border: 1px solid transparent;
  border-radius: 999px;
  background: rgb(255 255 255 / 70%);
  color: #4b5563;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.blog-page__filter:hover {
  background: #fff;
  border-color: #e5e7eb;
}

.blog-page__filter--active {
  background: var(--home-accent);
  border-color: var(--home-accent);
  color: #fff;
}

.blog-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.blog-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.25rem 1.3rem 1.15rem;
  color: inherit;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.blog-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgb(15 23 42 / 8%);
}

.blog-card__head {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.blog-card__thumb {
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #eef2f6;
}

.blog-card__thumb-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-card__thumb-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--home-accent-pale), #ecfeff);
  color: var(--home-accent-dark);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.blog-card__meta {
  min-width: 0;
  flex: 1;
}

.blog-card__title-row {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
}

.blog-card__title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 800;
  line-height: 1.35;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blog-card__year {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
}

.blog-card__sub {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blog-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.blog-card__tag {
  padding: 0.22rem 0.6rem;
  border-radius: 8px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.6875rem;
  font-weight: 600;
}

.blog-card__desc {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.65;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: auto;
  padding-top: 0.15rem;
}

.blog-card__stat {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.blog-card__stat svg {
  width: 0.9rem;
  height: 0.9rem;
  flex-shrink: 0;
}

.blog-page__empty {
  margin-top: 2rem;
  text-align: center;
  color: #9ca3af;
}

@media (max-width: 1100px) {
  .blog-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .blog-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
