<script setup lang="ts">
import { createCategory, deleteCategory, listCategories, type CategoryInfo } from '~/api/category'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({ title: '分类管理 · Chenaqi Blog' })

const newCategoryName = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const actionId = ref<number | null>(null)

const { data: categoriesData, pending, refresh } = await useAsyncData(
  'admin-categories',
  () => listCategories(),
)

const categories = computed(() => categoriesData.value?.categories ?? [])

function clearMessages() {
  error.value = ''
  success.value = ''
}

async function onCreate() {
  clearMessages()
  const name = newCategoryName.value.trim()
  if (!name) {
    error.value = '请输入分类名称'
    return
  }

  loading.value = true
  try {
    await createCategory(name)
    newCategoryName.value = ''
    success.value = `分类「${name}」已添加`
    await refresh()
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '创建分类失败'
  }
  finally {
    loading.value = false
  }
}

async function onDelete(category: CategoryInfo) {
  if (!confirm(`确定删除分类「${category.name}」吗？`))
    return

  clearMessages()
  actionId.value = category.id
  try {
    await deleteCategory(category.id)
    success.value = `已删除「${category.name}」`
    await refresh()
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '删除分类失败'
  }
  finally {
    actionId.value = null
  }
}

/** 根据名称生成稳定的配色索引 */
function categoryHue(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hues = [168, 199, 262, 32, 340, 210, 145]
  return hues[Math.abs(hash) % hues.length]
}
</script>

<template>
  <div class="cat-page">
    <header class="cat-header">
      <div class="cat-header__main">
        <div class="cat-header__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M4 7h7l2 3h7v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" stroke-linejoin="round" />
            <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke-linecap="round" />
          </svg>
        </div>
        <div>
          <h1 class="cat-header__title">
            分类管理
          </h1>
          <p class="cat-header__desc">
            管理博客文章分类，如前端、后端、Go 等
          </p>
        </div>
      </div>

      <div v-if="categories.length" class="cat-stat card">
        <span class="cat-stat__value">{{ categories.length }}</span>
        <span class="cat-stat__label">个分类</span>
      </div>
    </header>

    <Transition name="cat-toast">
      <div v-if="error" class="cat-alert cat-alert--error" role="alert">
        {{ error }}
      </div>
    </Transition>
    <Transition name="cat-toast">
      <div v-if="success" class="cat-alert cat-alert--success" role="status">
        {{ success }}
      </div>
    </Transition>

    <section class="cat-build card">
      <div class="cat-build__info">
        <h2 class="cat-section-title">
          添加分类
        </h2>
        <p class="cat-build__hint">
          分类名称建议简短，如「前端」「Docker」
        </p>
      </div>
      <form class="cat-build__form" @submit.prevent="onCreate">
        <div class="cat-build__input-wrap">
          <label class="cat-build__label" for="cat-name">分类名称</label>
          <input
            id="cat-name"
            v-model="newCategoryName"
            type="text"
            class="cat-build__input"
            placeholder="例如 前端"
            maxlength="32"
            autocomplete="off"
          >
        </div>
        <button type="submit" class="admin-btn admin-btn--primary" :disabled="loading">
          {{ loading ? '添加中…' : '添加分类' }}
        </button>
      </form>
    </section>

    <section class="cat-list">
      <h2 class="cat-section-title cat-list__title">
        全部分类
      </h2>

      <div v-if="pending" class="cat-empty card">
        <div class="cat-empty__spinner" />
        <p>加载中…</p>
      </div>

      <div v-else-if="!categories.length" class="cat-empty card">
        <div class="cat-empty__icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 14h10l3 5h19v20a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V14z" stroke-linejoin="round" />
          </svg>
        </div>
        <p class="cat-empty__title">
          还没有分类
        </p>
        <p class="cat-empty__desc">
          在上方输入名称，添加第一个分类
        </p>
      </div>

      <div v-else class="cat-grid">
        <article
          v-for="category in categories"
          :key="category.id"
          class="cat-card card"
        >
          <div
            class="cat-card__badge"
            :style="{ '--cat-hue': categoryHue(category.name) }"
          >
            <span>{{ category.name.slice(0, 2) }}</span>
          </div>
          <div class="cat-card__body">
            <h3 class="cat-card__name">
              {{ category.name }}
            </h3>
            <p class="cat-card__id">
              ID {{ category.id }}
            </p>
          </div>
          <button
            type="button"
            class="admin-btn admin-btn--danger-ghost"
            :disabled="actionId === category.id"
            @click="onDelete(category)"
          >
            {{ actionId === category.id ? '删除中…' : '删除' }}
          </button>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cat-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cat-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.cat-header__main {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.cat-header__icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 14px;
  background: linear-gradient(135deg, #ccfbf1, #99f6e4);
  color: #0d9488;
}

.cat-header__icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.cat-header__title {
  margin: 0;
  font-size: 1.65rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

.cat-header__desc {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.cat-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 1rem;
  min-width: 4.5rem;
}

.cat-stat__value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0d9488;
  line-height: 1.2;
}

.cat-stat__label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #9ca3af;
}

.cat-alert {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.cat-alert--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.cat-alert--success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.cat-toast-enter-active,
.cat-toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.cat-toast-enter-from,
.cat-toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.cat-section-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
}

.cat-build {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.35rem 1.5rem;
}

.cat-build__hint {
  margin: 0.3rem 0 0;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.cat-build__form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  flex: 1 1 18rem;
  max-width: 28rem;
}

.cat-build__input-wrap {
  flex: 1 1 10rem;
  min-width: 0;
}

.cat-build__label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.cat-build__input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 12px;
  background: rgb(255 255 255 / 85%);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.cat-build__input:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgb(20 184 166 / 14%);
}

.cat-list__title {
  margin-bottom: 0.85rem;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.75rem;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  transition: box-shadow 0.2s, transform 0.15s;
}

.cat-card:hover {
  box-shadow: 0 8px 28px rgb(20 184 166 / 12%);
  transform: translateY(-1px);
}

.cat-card__badge {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 12px;
  background: hsl(var(--cat-hue) 70% 92%);
  color: hsl(var(--cat-hue) 55% 38%);
  font-size: 0.8125rem;
  font-weight: 800;
}

.cat-card__body {
  flex: 1;
  min-width: 0;
}

.cat-card__name {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cat-card__id {
  margin: 0.15rem 0 0;
  font-size: 0.6875rem;
  color: #9ca3af;
}

.cat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

.cat-empty__icon {
  color: #d1d5db;
  margin-bottom: 1rem;
}

.cat-empty__icon svg {
  width: 3rem;
  height: 3rem;
}

.cat-empty__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.cat-empty__desc {
  margin: 0.4rem 0 0;
  font-size: 0.8125rem;
}

.cat-empty__spinner {
  width: 2rem;
  height: 2rem;
  margin-bottom: 0.75rem;
  border: 2.5px solid #e5e7eb;
  border-top-color: #14b8a6;
  border-radius: 50%;
  animation: cat-spin 0.7s linear infinite;
}

@keyframes cat-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .cat-build {
    flex-direction: column;
    align-items: stretch;
  }

  .cat-build__form {
    max-width: none;
  }
}
</style>
