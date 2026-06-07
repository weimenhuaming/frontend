<script setup lang="ts">
import { createArticle } from '~/api/article'
import { listCategories } from '~/api/category'
import { uploadBlogImage } from '~/api/upload'
import { renderMarkdown } from '~/utils/markdown'
import { resolveMediaUrl } from '~/utils/media'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({ title: '新建文章 · Chenaqi Blog' })

const auth = useAuth()
const router = useRouter()
const config = useRuntimeConfig()

const title = ref('')
const summary = ref('')
const categoryId = ref<number | ''>('')
const cover = ref('')
const content = ref('')
const editorMode = ref<'edit' | 'split' | 'preview'>('split')

const submitting = ref(false)
const uploadingCover = ref(false)
const error = ref('')
const success = ref('')

const fileInputRef = ref<HTMLInputElement | null>(null)
const coverInputRef = ref<HTMLInputElement | null>(null)

const coverPreviewUrl = computed(() => resolveMediaUrl(cover.value, config.public.apiBase))

const { data: categoriesData } = await useAsyncData('admin-create-categories', () => listCategories())
const categories = computed(() => categoriesData.value?.categories ?? [])

const categoryOptions = computed(() =>
  categories.value.map(category => ({
    value: category.id,
    label: category.name,
  })),
)

const previewContent = ref('')
let previewTimer: ReturnType<typeof setTimeout> | null = null

watch(content, (value) => {
  if (previewTimer)
    clearTimeout(previewTimer)
  previewTimer = setTimeout(() => {
    previewContent.value = value
  }, 150)
}, { immediate: true })

const renderedPreview = computed(() => renderMarkdown(previewContent.value).html)

const wordCount = computed(() => {
  const text = content.value.trim()
  return text ? text.length : 0
})

onUnmounted(() => {
  if (previewTimer)
    clearTimeout(previewTimer)
})

onMounted(() => auth.hydrate())

function applyImportedMarkdown(text: string, fileName?: string) {
  content.value = text

  const titleMatch = text.match(/^#\s+(.+)$/m)
  if (titleMatch && !title.value.trim())
    title.value = titleMatch[1].trim()

  if (!summary.value.trim()) {
    const paragraph = text
      .split('\n')
      .map(line => line.trim())
      .find(line => line && !line.startsWith('#') && !line.startsWith('```'))
    if (paragraph)
      summary.value = paragraph.slice(0, 120)
  }

  if (fileName && !title.value.trim())
    title.value = fileName.replace(/\.md$/i, '')
}

function onImportClick() {
  fileInputRef.value?.click()
}

function onFileChange(event: Event) {
  error.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return

  if (!/\.md$/i.test(file.name) && file.type && !file.type.includes('markdown') && file.type !== 'text/plain') {
    error.value = '请选择 .md 或纯文本 Markdown 文件'
    input.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    applyImportedMarkdown(String(reader.result ?? ''), file.name)
    success.value = `已导入 ${file.name}`
    input.value = ''
  }
  reader.onerror = () => {
    error.value = '文件读取失败，请重试'
    input.value = ''
  }
  reader.readAsText(file, 'utf-8')
}

function onCoverClick() {
  coverInputRef.value?.click()
}

async function onCoverChange(event: Event) {
  error.value = ''
  success.value = ''

  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return

  if (!file.type.startsWith('image/')) {
    error.value = '请选择图片文件'
    input.value = ''
    return
  }

  uploadingCover.value = true
  try {
    cover.value = await uploadBlogImage(file)
    success.value = '封面已上传'
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '封面上传失败'
  }
  finally {
    uploadingCover.value = false
    input.value = ''
  }
}

async function onSubmit() {
  error.value = ''
  success.value = ''

  const titleValue = title.value.trim()
  const summaryValue = summary.value.trim()
  const contentValue = content.value.trim()
  const categoryValue = Number(categoryId.value)

  if (!titleValue) {
    error.value = '请填写文章标题'
    return
  }
  if (!summaryValue) {
    error.value = '请填写文章摘要'
    return
  }
  if (!categoryValue) {
    error.value = '请选择分类'
    return
  }
  if (!contentValue) {
    error.value = '请填写 Markdown 正文'
    return
  }

  const userId = auth.user.value?.id
  if (!userId) {
    error.value = '未获取到登录用户信息，请重新登录'
    return
  }

  submitting.value = true
  try {
    await createArticle({
      title: titleValue,
      summary: summaryValue,
      content: contentValue,
      cover: cover.value.trim(),
      category_id: categoryValue,
      user_id: userId,
    })
    success.value = '文章发布成功'
    await router.push('/admin/articles')
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '发布失败，请重试'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="write-page">
    <!-- 顶栏 -->
    <header class="write-topbar card">
      <NuxtLink to="/admin/articles" class="write-topbar__back">
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
          <path fill-rule="evenodd" d="M11.78 4.22a.75.75 0 0 1 0 1.06L8.06 9h7.19a.75.75 0 0 1 0 1.5H8.06l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 0 1 1.06 0z" clip-rule="evenodd" />
        </svg>
        返回
      </NuxtLink>
      <span class="write-topbar__title">新建文章</span>
      <div class="write-topbar__actions">
        <button type="button" class="admin-btn admin-btn--ghost" @click="onImportClick">
          导入 .md
        </button>
        <button type="submit" form="article-form" class="admin-btn admin-btn--primary" :disabled="submitting">
          {{ submitting ? '发布中…' : '发布' }}
        </button>
      </div>
    </header>

    <Transition name="write-toast">
      <div v-if="error" class="write-alert write-alert--error" role="alert">{{ error }}</div>
    </Transition>
    <Transition name="write-toast">
      <div v-if="success" class="write-alert write-alert--success" role="status">{{ success }}</div>
    </Transition>

    <form id="article-form" class="write-layout" @submit.prevent="onSubmit">
      <!-- 左侧：写作区 -->
      <main class="write-main card">
        <input
          v-model="title"
          type="text"
          class="write-title"
          placeholder="文章标题"
          maxlength="120"
        >
        <textarea
          v-model="summary"
          class="write-summary"
          placeholder="写一段摘要，会显示在列表页…"
          rows="2"
          maxlength="300"
        />

        <div class="write-editor-bar">
          <div class="write-mode" role="group" aria-label="编辑器模式">
            <button
              type="button"
              class="write-mode__btn"
              :class="{ 'write-mode__btn--on': editorMode === 'edit' }"
              @click="editorMode = 'edit'"
            >
              编辑
            </button>
            <button
              type="button"
              class="write-mode__btn"
              :class="{ 'write-mode__btn--on': editorMode === 'split' }"
              @click="editorMode = 'split'"
            >
              分屏
            </button>
            <button
              type="button"
              class="write-mode__btn"
              :class="{ 'write-mode__btn--on': editorMode === 'preview' }"
              @click="editorMode = 'preview'"
            >
              预览
            </button>
          </div>
          <span v-if="wordCount > 0" class="write-wordcount">{{ wordCount }} 字</span>
        </div>

        <div class="write-workspace" :class="`write-workspace--${editorMode}`">
          <div v-if="editorMode !== 'preview'" class="write-pane">
            <textarea
              v-model="content"
              class="write-content"
              placeholder="在这里编写 Markdown 正文…"
              spellcheck="false"
            />
          </div>
          <div v-if="editorMode !== 'edit'" class="write-pane">
            <div class="write-preview markdown-body" v-html="renderedPreview" />
          </div>
        </div>
      </main>

      <!-- 右侧：发布设置 -->
      <aside class="write-aside">
        <section class="write-panel card">
          <h3 class="write-panel__title">发布设置</h3>

          <div class="write-panel__field">
            <span class="write-panel__label">分类</span>
            <AdminSelect
              v-model="categoryId"
              placeholder="选择分类"
              :options="categoryOptions"
            />
          </div>

          <div class="write-panel__field">
            <span class="write-panel__label">封面 <em>可选</em></span>
            <button
              type="button"
              class="write-cover"
              :class="{ 'write-cover--filled': coverPreviewUrl }"
              :disabled="uploadingCover"
              @click="onCoverClick"
            >
              <img v-if="coverPreviewUrl" :src="coverPreviewUrl" alt="封面" class="write-cover__img">
              <span v-else class="write-cover__placeholder">
                {{ uploadingCover ? '上传中…' : '+ 上传封面' }}
              </span>
            </button>
          </div>

          <div class="write-panel__meta">
            <span>摘要 {{ summary.length }}/300</span>
          </div>
        </section>
      </aside>

      <input
        ref="fileInputRef"
        type="file"
        accept=".md,text/markdown,text/plain"
        class="write-hidden"
        @change="onFileChange"
      >
      <input
        ref="coverInputRef"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        class="write-hidden"
        @change="onCoverChange"
      >
    </form>
  </div>
</template>

<style scoped>
.write-page {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 72rem;
  margin: 0 auto;
}

/* ── 顶栏 ── */
.write-topbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 1rem;
}

.write-topbar__back {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s;
}

.write-topbar__back:hover {
  color: #0d9488;
}

.write-topbar__title {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #374151;
}

.write-topbar__actions {
  display: flex;
  gap: 0.5rem;
}

/* ── 提示 ── */
.write-alert {
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.write-alert--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.write-alert--success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.write-toast-enter-active,
.write-toast-leave-active {
  transition: opacity 0.2s;
}

.write-toast-enter-from,
.write-toast-leave-to {
  opacity: 0;
}

/* ── 主布局：左写右设 ── */
.write-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 17rem;
  gap: 1rem;
  align-items: start;
}

.write-hidden {
  display: none;
}

/* ── 左侧写作区 ── */
.write-main {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 12rem);
  padding: 1.5rem 1.75rem 1.25rem;
}

.write-title {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 12px;
  background: rgb(255 255 255 / 85%);
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.write-title:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgb(20 184 166 / 14%);
}

.write-title::placeholder {
  color: #9ca3af;
  font-weight: 500;
}

.write-summary {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.7rem 1rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 12px;
  background: rgb(255 255 255 / 85%);
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.write-summary:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgb(20 184 166 / 14%);
}

.write-summary::placeholder {
  color: #9ca3af;
}

.write-editor-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgb(0 0 0 / 6%);
}

.write-mode {
  display: inline-flex;
  gap: 0.15rem;
}

.write-mode__btn {
  padding: 0.35rem 0.7rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.write-mode__btn:hover {
  color: #4b5563;
}

.write-mode__btn--on {
  background: #f0fdfa;
  color: #0d9488;
}

.write-wordcount {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.write-workspace {
  display: grid;
  flex: 1;
  gap: 0;
  margin-top: 0.75rem;
  min-height: 0;
}

.write-workspace--edit,
.write-workspace--preview {
  grid-template-columns: 1fr;
}

.write-workspace--split {
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgb(0 0 0 / 6%);
  border-radius: 10px;
  overflow: hidden;
}

.write-pane {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.write-workspace--split .write-pane {
  background: rgb(255 255 255 / 90%);
}

.write-content {
  flex: 1;
  width: 100%;
  min-height: 28rem;
  padding: 0;
  border: none;
  background: transparent;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  font-size: 0.875rem;
  line-height: 1.75;
  color: #1f2937;
  resize: none;
  outline: none;
}

.write-workspace--split .write-content {
  padding: 1rem;
  min-height: 28rem;
}

.write-preview {
  flex: 1;
  min-height: 28rem;
  overflow-y: auto;
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #374151;
}

.write-workspace--split .write-preview {
  padding: 1rem;
}

.write-preview :deep(h1),
.write-preview :deep(h2),
.write-preview :deep(h3) {
  margin: 1rem 0 0.5rem;
  color: #111827;
}

.write-preview :deep(p) {
  margin: 0 0 0.75rem;
}

.write-preview :deep(pre) {
  margin: 0.75rem 0;
  padding: 0.85rem;
  overflow-x: auto;
  border-radius: 8px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 0.8125rem;
}

.write-preview :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
  font-size: inherit;
}

.write-preview :deep(:not(pre) > code) {
  padding: 0.12em 0.3em;
  border-radius: 4px;
  background: #f3f4f6;
  font-family: ui-monospace, monospace;
}

/* ── 右侧设置栏 ── */
.write-aside {
  position: sticky;
  top: 5.5rem;
}

.write-panel {
  padding: 1.15rem 1.2rem;
}

.write-panel__title {
  margin: 0 0 1rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #374151;
}

.write-panel__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.write-panel__label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.write-panel__label em {
  font-style: normal;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  color: #d1d5db;
}

.write-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  padding: 0;
  border: 1.5px dashed #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.write-cover:hover:not(:disabled) {
  border-color: #14b8a6;
  background: #f0fdfa;
}

.write-cover--filled {
  border-style: solid;
  border-color: rgb(0 0 0 / 8%);
}

.write-cover:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.write-cover__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.write-cover__placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: #9ca3af;
  font-size: 0.8125rem;
}

.write-panel__meta {
  padding-top: 0.75rem;
  border-top: 1px solid rgb(0 0 0 / 6%);
  font-size: 0.75rem;
  color: #9ca3af;
}

@media (max-width: 900px) {
  .write-layout {
    grid-template-columns: 1fr;
  }

  .write-aside {
    position: static;
  }

  .write-main {
    min-height: auto;
  }

  .write-workspace--split {
    grid-template-columns: 1fr;
  }

  .write-content,
  .write-preview {
    min-height: 16rem;
  }
}
</style>
