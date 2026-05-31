<script setup lang="ts">
import { getArticleDetail } from '~/api/article'
import { listCategories } from '~/api/category'
import { renderMarkdown, type MarkdownHeading } from '~/utils/markdown'

definePageMeta({ layout: 'home' })

const route = useRoute()

const articleId = computed(() => {
  const id = Number(route.params.id)
  return Number.isFinite(id) && id > 0 ? id : null
})

const { data: article, pending, error } = await useAsyncData(
  () => `article-${articleId.value}`,
  () => {
    if (!articleId.value)
      return Promise.reject(new Error('文章不存在'))
    return getArticleDetail(articleId.value)
  },
  { watch: [articleId] },
)

const { data: categoriesData } = await useAsyncData('blog-categories', () => listCategories())

const categoryName = computed(() => {
  if (!article.value)
    return ''
  return categoriesData.value?.categories.find(c => c.id === article.value!.category_id)?.name ?? ''
})

const markdownResult = computed(() => {
  if (!article.value?.content)
    return { html: '', headings: [] as MarkdownHeading[] }
  return renderMarkdown(article.value.content)
})

const renderedContent = computed(() => markdownResult.value.html)
const tableOfContents = computed(() => markdownResult.value.headings)

const showBackTop = ref(false)
const commentCount = ref(0)

const articleLike = useLikeToggle({
  type: 'article',
  id: () => articleId.value ?? 0,
  initialCount: () => article.value?.like_count ?? 0,
})

const articleLiked = computed(() => articleLike.liked.value)
const articleLikeCount = computed(() => articleLike.likeCount.value)

watch(
  () => article.value?.comment_count,
  (count) => {
    if (typeof count === 'number')
      commentCount.value = count
  },
  { immediate: true },
)

function onScroll() {
  showBackTop.value = window.scrollY > 400
}

function scrollToComments() {
  document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

watchEffect(() => {
  if (article.value)
    useSeoMeta({ title: `${article.value.title} · Chenaqi Blog` })
})

function formatDate(dateStr: string) {
  if (!dateStr)
    return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime()))
    return dateStr.slice(0, 10)
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
}
</script>

<template>
  <div class="article-page">
    <NuxtLink to="/blog" class="article-page__back">
      ← 返回文章列表
    </NuxtLink>

    <p v-if="pending" class="article-page__status">
      加载中...
    </p>

    <p v-else-if="error || !articleId" class="article-page__status">
      {{ error?.message || '文章不存在' }}
    </p>

    <div v-else-if="article" class="article-page__layout">
      <article class="article-page__main card">
        <header class="article-page__header">
          <h1 class="article-page__title">
            {{ article.title }}
          </h1>

          <div v-if="article.author_name" class="article-page__author">
            <img
              v-if="article.author_avatar"
              :src="article.author_avatar"
              :alt="article.author_name"
              class="article-page__author-avatar article-page__author-avatar--header"
            >
            <div
              v-else
              class="article-page__author-avatar article-page__author-avatar--header article-page__author-avatar--placeholder"
              aria-hidden="true"
            >
              👤
            </div>
            <span class="article-page__author-name">{{ article.author_name }}</span>
          </div>

          <div class="article-page__tags">
            <span v-if="categoryName" class="article-page__tag">#{{ categoryName }}</span>
          </div>
          <p class="article-page__date">
            {{ formatDate(article.created_at) }}
          </p>
        </header>

        <img
          v-if="article.cover"
          :src="article.cover"
          :alt="article.title"
          class="article-page__cover"
        >

        <div class="article-page__content markdown-body" v-html="renderedContent" />
      </article>

      <aside class="article-page__sidebar">
        <div class="article-page__sidebar-card card">
          <div class="article-page__author-card">
            <img
              v-if="article.author_avatar"
              :src="article.author_avatar"
              :alt="article.author_name"
              class="article-page__author-avatar"
            >
            <div
              v-else
              class="article-page__author-avatar article-page__author-avatar--placeholder"
              aria-hidden="true"
            >
              👤
            </div>
          </div>
        </div>

        <div v-if="article.summary" class="article-page__sidebar-card card">
          <h2 class="article-page__sidebar-title">
            摘要
          </h2>
          <p class="article-page__sidebar-summary">
            {{ article.summary }}
          </p>
        </div>

        <nav
          v-if="tableOfContents.length"
          class="article-page__sidebar-card article-page__sidebar-card--toc card"
          aria-label="文章目录"
        >
          <h2 class="article-page__sidebar-title">
            目录
          </h2>
          <ul class="article-page__toc-list">
            <li
              v-for="heading in tableOfContents"
              :key="heading.id"
              class="article-page__toc-item"
              :class="{ 'article-page__toc-item--h2': heading.level === 2 }"
            >
              <a
                href="#"
                class="article-page__toc-link"
                :title="heading.text"
                @click.prevent="scrollToHeading(heading.id)"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>

    <CommentSection
      v-if="article && articleId"
      :article-id="articleId"
      @count-change="commentCount += $event"
    />

    <div v-if="article" class="article-page__float-actions" aria-label="文章互动">
      <div class="article-page__float-stat card" title="阅读量">
        <span class="article-page__float-count">{{ article.view_count }}</span>
        <span class="article-page__float-icon article-page__float-icon--view" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      </div>

      <button
        type="button"
        class="article-page__float-stat article-page__float-stat--btn card"
        title="查看评论"
        aria-label="查看评论"
        @click="scrollToComments"
      >
        <span class="article-page__float-count">{{ commentCount }}</span>
        <span class="article-page__float-icon article-page__float-icon--comment" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        </span>
      </button>

      <button
        type="button"
        class="article-page__float-stat article-page__float-stat--btn card"
        :class="{ 'article-page__float-stat--liked': articleLiked }"
        title="点赞"
        aria-label="点赞"
        :aria-pressed="articleLiked"
        @click="articleLike.toggle"
      >
        <span
          class="article-page__float-count article-page__float-count--like"
          :class="{ 'article-page__float-count--liked': articleLiked }"
        >
          {{ articleLikeCount }}
        </span>
        <span class="article-page__float-icon article-page__float-icon--like" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      </button>

      <Transition name="back-top">
        <button
          v-if="showBackTop"
          type="button"
          class="article-page__float-stat article-page__float-stat--btn card"
          aria-label="回到顶部"
          @click="scrollToTop"
        >
          <span class="article-page__float-icon article-page__float-icon--top" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </span>
        </button>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.article-page {
  width: 100%;
  max-width: 68rem;
  margin: -1cm auto 0;
}

.article-page__back {
  display: inline-block;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  color: var(--home-accent-dark);
  text-decoration: none;
  transition: color 0.15s;
}

.article-page__back:hover {
  color: var(--home-accent);
}

.article-page__status {
  text-align: center;
  color: #9ca3af;
}

.article-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 17rem;
  gap: 1.25rem;
  align-items: start;
}

.article-page__main {
  padding: 2.5rem 2.75rem;
  border-radius: 22px;
  color: #374151;
}

.article-page__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.article-page__title {
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.35rem);
  font-weight: 800;
  line-height: 1.3;
  color: #1a1a1a;
}

.article-page__author {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1rem;
}

.article-page__author-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #4b5563;
}

.article-page__tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.article-page__tag {
  font-size: 0.875rem;
  color: #9ca3af;
}

.article-page__date {
  margin: 0.65rem 0 0;
  font-size: 0.875rem;
  color: #9ca3af;
}

.article-page__cover {
  width: 100%;
  margin-top: 1.75rem;
  border-radius: 16px;
  object-fit: cover;
}

.article-page__content {
  margin-top: 2rem;
  font-size: 1.0625rem;
  line-height: 1.9;
  word-break: break-word;
}

.article-page__content :deep(p) {
  margin: 0 0 1rem;
}

.article-page__content :deep(p:last-child) {
  margin-bottom: 0;
}

.article-page__content :deep(h1),
.article-page__content :deep(h2),
.article-page__content :deep(h3),
.article-page__content :deep(h4) {
  margin: 1.75rem 0 0.85rem;
  line-height: 1.35;
  color: #1a1a1a;
}

.article-page__content :deep(h1),
.article-page__content :deep(h2) {
  scroll-margin-top: 6rem;
}

.article-page__content :deep(h1:first-child),
.article-page__content :deep(h2:first-child),
.article-page__content :deep(h3:first-child) {
  margin-top: 0;
}

.article-page__content :deep(h2)::before,
.article-page__content :deep(h3)::before {
  content: '# ';
  color: var(--home-accent);
  font-weight: 700;
}

.article-page__content :deep(ul),
.article-page__content :deep(ol) {
  margin: 0 0 1rem;
  padding-left: 1.5rem;
}

.article-page__content :deep(li + li) {
  margin-top: 0.35rem;
}

.article-page__content :deep(li > p) {
  margin: 0;
}

.article-page__content :deep(a) {
  color: var(--home-accent-dark);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-page__content :deep(a:hover) {
  color: var(--home-accent);
}

.article-page__content :deep(pre) {
  margin: 1rem 0;
  padding: 1rem 1.1rem;
  overflow-x: auto;
  border-radius: 12px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 0.875rem;
  line-height: 1.6;
}

.article-page__content :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
  font-size: inherit;
}

.article-page__content :deep(:not(pre) > code) {
  padding: 0.15em 0.4em;
  border-radius: 4px;
  background: #f3f4f6;
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: #be185d;
}

.article-page__content :deep(img) {
  max-width: 100%;
  margin: 1rem 0;
  border-radius: 12px;
}

.article-page__content :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--home-accent);
  background: var(--home-accent-pale);
  color: #4b5563;
}

.article-page__content :deep(blockquote p) {
  margin: 0;
}

.article-page__content :deep(hr) {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid rgb(0 0 0 / 8%);
}

.article-page__content :deep(table) {
  width: 100%;
  margin: 1rem 0;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.article-page__content :deep(th),
.article-page__content :deep(td) {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
}

.article-page__content :deep(th) {
  background: var(--home-accent-pale);
}

.article-page__sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 6rem;
  max-height: calc(100vh - 7rem);
  min-height: 0;
}

.article-page__sidebar-card {
  padding: 1.25rem;
  border-radius: 18px;
  flex-shrink: 0;
}

.article-page__sidebar-card--toc {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.article-page__author-card {
  display: flex;
  justify-content: center;
}

.article-page__author-avatar {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 16px;
  object-fit: cover;
}

.article-page__author-avatar--header {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
}

.article-page__author-avatar--placeholder {
  display: grid;
  place-items: center;
  background: var(--home-accent-pale);
  font-size: 2rem;
}

.article-page__author-avatar--header.article-page__author-avatar--placeholder {
  font-size: 0.95rem;
}

.article-page__sidebar-title {
  margin: 0 0 0.65rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
}

.article-page__sidebar-summary {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.7;
  color: #6b7280;
}

.article-page__sidebar-card--toc .article-page__sidebar-title {
  flex-shrink: 0;
}

.article-page__toc-list {
  margin: 0;
  padding: 0 0.15rem 0 0;
  list-style: none;
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;
  max-height: min(28rem, calc(100vh - 16rem));
  scrollbar-width: thin;
  scrollbar-color: rgb(20 184 166 / 35%) transparent;
}

.article-page__toc-list::-webkit-scrollbar {
  width: 4px;
}

.article-page__toc-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(20 184 166 / 35%);
}

.article-page__toc-list::-webkit-scrollbar-thumb:hover {
  background: rgb(20 184 166 / 55%);
}

.article-page__toc-item + .article-page__toc-item {
  margin-top: 0.45rem;
}

.article-page__toc-item--h2 {
  padding-left: 0.85rem;
}

.article-page__toc-link {
  display: block;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-page__toc-link:hover {
  color: var(--home-accent-dark);
}

.article-page__float-actions {
  position: fixed;
  right: max(1.25rem, calc((100vw - 68rem) / 2 - 4.5rem));
  bottom: 2.5rem;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
}

.article-page__float-stat {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  transition: transform 0.15s;
}

.article-page__float-stat--btn {
  padding: 0;
  border: none;
  cursor: pointer;
}

.article-page__float-stat--btn:hover {
  transform: scale(1.05);
}

.article-page__float-stat--btn .article-page__float-count {
  pointer-events: none;
}

.article-page__float-stat--liked .article-page__float-icon--like {
  color: #fb7185;
}

.article-page__float-count--liked {
  background: #fb7185;
}

.article-page__float-stat--btn:active {
  transform: scale(0.95);
}

.article-page__float-count {
  position: absolute;
  top: -0.35rem;
  left: calc(100% - 0.75rem);
  min-width: 1.5rem;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  background: #d1d5db;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.article-page__float-count--like {
  background: #fb7185;
}

.article-page__float-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-page__float-icon svg {
  width: 1.55rem;
  height: 1.55rem;
}

.article-page__float-icon--view {
  color: #60a5fa;
}

.article-page__float-icon--comment {
  color: #a78bfa;
}

.article-page__float-icon--like {
  color: #fb7185;
}

.article-page__float-icon--top {
  color: var(--home-accent-dark);
}

.back-top-enter-active,
.back-top-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

@media (max-width: 960px) {
  .article-page__layout {
    grid-template-columns: 1fr;
  }

  .article-page__sidebar {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    max-height: none;
  }

  .article-page__sidebar-card {
    flex: 1 1 14rem;
  }

  .article-page__sidebar-card--toc {
    flex: 1 1 100%;
  }

  .article-page__toc-list {
    max-height: 16rem;
  }

  .article-page__main {
    padding: 1.75rem 1.5rem;
  }

  .article-page__float-actions {
    right: 1rem;
    bottom: 1.5rem;
  }
}
</style>
