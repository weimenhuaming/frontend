<script setup lang="ts">
import {
  buildKnowledge,
  deleteKnowledgeCollection,
  listKnowledgeCollections,
  switchKnowledgeRetriever,
  type KnowledgeCollectionInfo,
} from '~/api/knowledge'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({ title: '知识库管理 · Chenaqi Blog' })

const newCollectionName = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const actionName = ref('')
const activeCollection = useState<string | null>('knowledge-active-collection', () => null)

const { data: collectionsData, pending, refresh } = await useAsyncData(
  'admin-knowledge-collections',
  () => listKnowledgeCollections(),
  { server: false },
)

const collections = computed(() => collectionsData.value?.collections ?? [])

const totalStats = computed(() => {
  return collections.value.reduce(
    (acc, item) => ({
      docs: acc.docs + item.doc_count,
      chunks: acc.chunks + item.chunk_count,
      vectors: acc.vectors + item.count,
    }),
    { docs: 0, chunks: 0, vectors: 0 },
  )
})

function clearMessages() {
  error.value = ''
  success.value = ''
}

async function onBuild() {
  clearMessages()
  const name = newCollectionName.value.trim()
  if (!name) {
    error.value = '请输入知识库名称'
    return
  }

  loading.value = true
  actionName.value = 'build'
  try {
    const result = await buildKnowledge(name)
    success.value = result.message || `知识库「${name}」构建成功`
    newCollectionName.value = ''
    await refresh()
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '构建知识库失败'
  }
  finally {
    loading.value = false
    actionName.value = ''
  }
}

async function onSwitch(item: KnowledgeCollectionInfo) {
  if (activeCollection.value === item.name)
    return

  clearMessages()
  loading.value = true
  actionName.value = item.name
  try {
    const result = await switchKnowledgeRetriever(item.name)
    activeCollection.value = item.name
    success.value = result.message || `已切换至「${item.name}」`
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '切换检索器失败'
  }
  finally {
    loading.value = false
    actionName.value = ''
  }
}

async function onDelete(item: KnowledgeCollectionInfo) {
  if (!confirm(`确定删除知识库「${item.name}」吗？删除后不可恢复。`))
    return

  clearMessages()
  loading.value = true
  actionName.value = item.name
  try {
    await deleteKnowledgeCollection(item.name)
    if (activeCollection.value === item.name)
      activeCollection.value = null
    success.value = `已删除「${item.name}」`
    await refresh()
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '删除失败'
  }
  finally {
    loading.value = false
    actionName.value = ''
  }
}

function isBusy(name: string) {
  return loading.value && actionName.value === name
}
</script>

<template>
  <div class="kb-page">
    <!-- 页头 -->
    <header class="kb-header">
      <div class="kb-header__main">
        <div class="kb-header__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke-linecap="round" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M8 7h8M8 11h6" stroke-linecap="round" />
          </svg>
        </div>
        <div>
          <h1 class="kb-header__title">
            知识库管理
          </h1>
          <p class="kb-header__desc">
            将 <span class="kb-code">data/knowledge/</span> 目录文档向量化入库，供站内助手检索问答
          </p>
        </div>
      </div>

      <div v-if="collections.length" class="kb-stats">
        <div class="kb-stat">
          <span class="kb-stat__value">{{ collections.length }}</span>
          <span class="kb-stat__label">知识库</span>
        </div>
        <div class="kb-stat">
          <span class="kb-stat__value">{{ totalStats.docs }}</span>
          <span class="kb-stat__label">文档</span>
        </div>
        <div class="kb-stat">
          <span class="kb-stat__value">{{ totalStats.chunks }}</span>
          <span class="kb-stat__label">切片</span>
        </div>
        <div class="kb-stat">
          <span class="kb-stat__value">{{ totalStats.vectors }}</span>
          <span class="kb-stat__label">向量</span>
        </div>
      </div>
    </header>

    <!-- 提示条 -->
    <Transition name="kb-toast">
      <div v-if="error" class="kb-alert kb-alert--error" role="alert">
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </div>
    </Transition>
    <Transition name="kb-toast">
      <div v-if="success" class="kb-alert kb-alert--success" role="status">
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
        {{ success }}
      </div>
    </Transition>

    <!-- 构建区 -->
    <section class="kb-build card">
      <div class="kb-build__info">
        <h2 class="kb-section-title">
          新建知识库
        </h2>
        <p class="kb-build__hint">
          名称不可重复；文档更新后请用<strong>新名称</strong>重新构建
        </p>
      </div>
      <form class="kb-build__form" @submit.prevent="onBuild">
        <div class="kb-build__input-wrap">
          <label class="kb-build__label" for="kb-name">Collection 名称</label>
          <input
            id="kb-name"
            v-model="newCollectionName"
            type="text"
            class="kb-build__input"
            placeholder="例如 chenaqi_knowledge_v2"
            maxlength="64"
            autocomplete="off"
          >
        </div>
        <button type="submit" class="kb-btn kb-btn--primary" :disabled="loading">
          <svg v-if="loading && actionName === 'build'" class="kb-btn__spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke-linecap="round" />
          </svg>
          <span>{{ loading && actionName === 'build' ? '构建中…' : '开始构建' }}</span>
        </button>
      </form>
    </section>

    <!-- 列表区 -->
    <section class="kb-list">
      <div class="kb-list__toolbar">
        <h2 class="kb-section-title">
          知识库列表
        </h2>
        <div v-if="activeCollection" class="kb-active-badge">
          <span class="kb-active-badge__dot" />
          当前检索：{{ activeCollection }}
        </div>
      </div>

      <!-- 加载 -->
      <div v-if="pending" class="kb-empty card">
        <div class="kb-empty__spinner" />
        <p>加载中…</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!collections.length" class="kb-empty card">
        <div class="kb-empty__icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="8" y="6" width="32" height="36" rx="4" />
            <path d="M16 16h16M16 24h12M16 32h8" stroke-linecap="round" />
          </svg>
        </div>
        <p class="kb-empty__title">
          还没有知识库
        </p>
        <p class="kb-empty__desc">
          在上方输入名称，从 data/knowledge/ 构建第一个向量索引
        </p>
      </div>

      <!-- 卡片网格 -->
      <div v-else class="kb-grid">
        <article
          v-for="item in collections"
          :key="item.name"
          class="kb-card card"
          :class="{ 'kb-card--active': item.name === activeCollection }"
        >
          <div class="kb-card__top">
            <div class="kb-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
              </svg>
            </div>
            <div class="kb-card__meta">
              <h3 class="kb-card__name">
                {{ item.name }}
              </h3>
              <span v-if="item.name === activeCollection" class="kb-card__tag">使用中</span>
            </div>
          </div>

          <div class="kb-card__metrics">
            <div class="kb-metric">
              <span class="kb-metric__num">{{ item.doc_count }}</span>
              <span class="kb-metric__lbl">文档</span>
            </div>
            <div class="kb-metric">
              <span class="kb-metric__num">{{ item.chunk_count }}</span>
              <span class="kb-metric__lbl">切片</span>
            </div>
            <div class="kb-metric">
              <span class="kb-metric__num">{{ item.count }}</span>
              <span class="kb-metric__lbl">向量</span>
            </div>
          </div>

          <div class="kb-card__actions">
            <button
              type="button"
              class="kb-btn kb-btn--ghost"
              :class="{ 'kb-btn--ghost-active': item.name === activeCollection }"
              :disabled="loading || item.name === activeCollection"
              @click="onSwitch(item)"
            >
              {{ isBusy(item.name) ? '切换中…' : item.name === activeCollection ? '已启用' : '设为当前' }}
            </button>
            <button
              type="button"
              class="kb-btn kb-btn--danger-ghost"
              :disabled="loading"
              @click="onDelete(item)"
            >
              删除
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.kb-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Header ── */
.kb-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
}

.kb-header__main {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.kb-header__icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 14px;
  background: linear-gradient(135deg, #ccfbf1, #99f6e4);
  color: #0d9488;
}

.kb-header__icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.kb-header__title {
  margin: 0;
  font-size: 1.65rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

.kb-header__desc {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: #6b7280;
}

.kb-code {
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  background: rgb(20 184 166 / 10%);
  color: #0f766e;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  font-size: 0.8125rem;
}

/* ── Stats ── */
.kb-stats {
  display: flex;
  gap: 0.5rem;
}

.kb-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 4.25rem;
  padding: 0.6rem 0.85rem;
  border-radius: 14px;
  background: rgb(255 255 255 / 65%);
  border: 1px solid rgb(255 255 255 / 90%);
  box-shadow: 0 2px 12px rgb(20 184 166 / 8%);
}

.kb-stat__value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0d9488;
  line-height: 1.2;
}

.kb-stat__label {
  margin-top: 0.15rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── Alerts ── */
.kb-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.kb-alert svg {
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
}

.kb-alert--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.kb-alert--success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.kb-toast-enter-active,
.kb-toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.kb-toast-enter-from,
.kb-toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Build ── */
.kb-build {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.35rem 1.5rem;
}

.kb-section-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
}

.kb-build__hint {
  margin: 0.3rem 0 0;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.kb-build__hint strong {
  color: #6b7280;
  font-weight: 600;
}

.kb-build__form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  flex: 1 1 20rem;
  max-width: 32rem;
}

.kb-build__input-wrap {
  flex: 1 1 12rem;
  min-width: 0;
}

.kb-build__label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.kb-build__input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 12px;
  background: rgb(255 255 255 / 85%);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.kb-build__input:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgb(20 184 166 / 14%);
}

/* ── List toolbar ── */
.kb-list__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.kb-active-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgb(20 184 166 / 10%);
  color: #0f766e;
  font-size: 0.75rem;
  font-weight: 600;
}

.kb-active-badge__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #14b8a6;
  box-shadow: 0 0 0 3px rgb(20 184 166 / 25%);
  animation: kb-pulse 2s ease-in-out infinite;
}

@keyframes kb-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ── Empty ── */
.kb-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.kb-empty__icon {
  color: #d1d5db;
  margin-bottom: 1rem;
}

.kb-empty__icon svg {
  width: 3rem;
  height: 3rem;
}

.kb-empty__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.kb-empty__desc {
  margin: 0.4rem 0 0;
  font-size: 0.8125rem;
  color: #9ca3af;
  max-width: 22rem;
}

.kb-empty__spinner {
  width: 2rem;
  height: 2rem;
  margin-bottom: 0.75rem;
  border: 2.5px solid #e5e7eb;
  border-top-color: #14b8a6;
  border-radius: 50%;
  animation: kb-spin 0.7s linear infinite;
}

@keyframes kb-spin {
  to { transform: rotate(360deg); }
}

/* ── Card grid ── */
.kb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 0.85rem;
}

.kb-card {
  padding: 1.15rem 1.2rem;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
}

.kb-card:hover {
  box-shadow: 0 8px 28px rgb(20 184 166 / 14%);
  transform: translateY(-1px);
}

.kb-card--active {
  border-color: rgb(20 184 166 / 35%);
  box-shadow: 0 4px 20px rgb(20 184 166 / 16%);
}

.kb-card__top {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.kb-card__icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  background: #f0fdfa;
  color: #0d9488;
}

.kb-card__icon svg {
  width: 1.15rem;
  height: 1.15rem;
}

.kb-card__meta {
  min-width: 0;
  flex: 1;
}

.kb-card__name {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  word-break: break-all;
  line-height: 1.35;
}

.kb-card__tag {
  display: inline-block;
  margin-top: 0.3rem;
  padding: 0.1rem 0.45rem;
  border-radius: 6px;
  background: #ccfbf1;
  color: #0f766e;
  font-size: 0.6875rem;
  font-weight: 700;
}

.kb-card__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.kb-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.55rem 0.25rem;
  border-radius: 10px;
  background: rgb(249 250 251 / 80%);
}

.kb-metric__num {
  font-size: 1.125rem;
  font-weight: 800;
  color: #374151;
  line-height: 1.2;
}

.kb-metric__lbl {
  margin-top: 0.1rem;
  font-size: 0.6875rem;
  color: #9ca3af;
  font-weight: 500;
}

.kb-card__actions {
  display: flex;
  gap: 0.5rem;
}

/* ── Buttons ── */
.kb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border: none;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, opacity 0.15s;
  white-space: nowrap;
}

.kb-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.kb-btn--primary {
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  color: #fff;
  box-shadow: 0 2px 8px rgb(20 184 166 / 30%);
}

.kb-btn--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0d9488, #0f766e);
}

.kb-btn--ghost {
  flex: 1;
  background: #f3f4f6;
  color: #374151;
}

.kb-btn--ghost:hover:not(:disabled) {
  background: #e5e7eb;
}

.kb-btn--ghost-active {
  background: #ccfbf1;
  color: #0f766e;
}

.kb-btn--danger-ghost {
  background: transparent;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.kb-btn--danger-ghost:hover:not(:disabled) {
  background: #fef2f2;
}

.kb-btn__spin {
  width: 1rem;
  height: 1rem;
  animation: kb-spin 0.8s linear infinite;
}

@media (max-width: 640px) {
  .kb-header {
    flex-direction: column;
  }

  .kb-stats {
    width: 100%;
    justify-content: space-between;
  }

  .kb-stat {
    flex: 1;
    min-width: 0;
  }

  .kb-build {
    flex-direction: column;
    align-items: stretch;
  }

  .kb-build__form {
    max-width: none;
  }
}
</style>
