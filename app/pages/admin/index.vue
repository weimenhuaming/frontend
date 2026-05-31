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
const actionId = ref<number | null>(null)

const { data: categoriesData, refresh } = await useAsyncData(
  'admin-categories',
  () => listCategories(),
)

const categories = computed(() => categoriesData.value?.categories ?? [])

async function onCreate() {
  error.value = ''
  const name = newCategoryName.value.trim()
  if (!name) {
    error.value = '请输入分类名称'
    return
  }

  loading.value = true
  try {
    await createCategory(name)
    newCategoryName.value = ''
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

  error.value = ''
  actionId.value = category.id
  try {
    await deleteCategory(category.id)
    await refresh()
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '删除分类失败'
  }
  finally {
    actionId.value = null
  }
}
</script>

<template>
  <div class="admin-view">
    <header class="admin-view__header">
      <h1 class="admin-view__title">
        分类管理
      </h1>
      <p class="admin-view__desc">
        添加或删除博客分类，如前端、后端、Go 等。
      </p>
    </header>

    <section class="admin-panel card">
      <form class="admin-panel__form" @submit.prevent="onCreate">
        <input
          v-model="newCategoryName"
          type="text"
          class="admin-panel__input"
          placeholder="新分类名称"
          maxlength="32"
        >
        <button type="submit" class="admin-panel__btn admin-panel__btn--primary" :disabled="loading">
          {{ loading ? '添加中...' : '添加分类' }}
        </button>
      </form>

      <p v-if="error" class="admin-panel__error">
        {{ error }}
      </p>

      <ul v-if="categories.length" class="admin-list">
        <li v-for="category in categories" :key="category.id" class="admin-list__item">
          <span class="admin-list__name">{{ category.name }}</span>
          <button
            type="button"
            class="admin-panel__btn admin-panel__btn--danger"
            :disabled="actionId === category.id"
            @click="onDelete(category)"
          >
            {{ actionId === category.id ? '删除中...' : '删除' }}
          </button>
        </li>
      </ul>
      <p v-else class="admin-panel__empty">
        暂无分类，请先添加
      </p>
    </section>
  </div>
</template>
