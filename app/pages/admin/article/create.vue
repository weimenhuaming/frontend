<script setup lang="ts">
import { createArticle } from '~/api/article'
import { listCategories } from '~/api/category'
import { renderMarkdown } from '~/utils/markdown'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({ title: '新建文章 · Chenaqi Blog' })

const auth = useAuth()
const router = useRouter()

const title = ref('')
const summary = ref('')
const categoryId = ref<number | ''>('')
const cover = ref('')
const content = ref('')
const editorMode = ref<'edit' | 'split' | 'preview'>('split')

const submitting = ref(false)
const error = ref('')
const success = ref('')

const fileInputRef = ref<HTMLInputElement | null>(null)

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
  <div class="admin-view">
    <header class="admin-view__header">
      <h1 class="admin-view__title">
        新建文章
      </h1>
      <p class="admin-view__desc">
        正文支持 Markdown，也可导入本地 .md 文件。
      </p>
    </header>

    <form class="create-form card" @submit.prevent="onSubmit">
      <div class="create-form__grid">
        <label class="create-form__field create-form__field--full">
          <span class="create-form__label">标题</span>
          <input v-model="title" type="text" class="create-form__input" placeholder="文章标题" maxlength="120">
        </label>

        <label class="create-form__field create-form__field--full">
          <span class="create-form__label">摘要</span>
          <textarea
            v-model="summary"
            class="create-form__textarea create-form__textarea--short"
            placeholder="用于列表展示的简短摘要"
            rows="3"
            maxlength="300"
          />
        </label>

        <div class="create-form__field">
          <span class="create-form__label">分类</span>
          <AdminSelect
            v-model="categoryId"
            placeholder="请选择分类"
            :options="categoryOptions"
          />
        </div>

        <label class="create-form__field">
          <span class="create-form__label">封面链接（可选）</span>
          <input v-model="cover" type="url" class="create-form__input" placeholder="https://...">
        </label>
      </div>

      <div class="create-form__editor">
        <div class="create-form__editor-head">
          <span class="create-form__label">Markdown 正文</span>
          <div class="create-form__editor-actions">
            <input
              ref="fileInputRef"
              type="file"
              accept=".md,text/markdown,text/plain"
              class="create-form__file-input"
              @change="onFileChange"
            >
            <button type="button" class="create-form__tool-btn" @click="onImportClick">
              导入 .md
            </button>
            <button
              type="button"
              class="create-form__tool-btn"
              :class="{ 'create-form__tool-btn--active': editorMode === 'edit' }"
              @click="editorMode = 'edit'"
            >
              编辑
            </button>
            <button
              type="button"
              class="create-form__tool-btn"
              :class="{ 'create-form__tool-btn--active': editorMode === 'split' }"
              @click="editorMode = 'split'"
            >
              分屏
            </button>
            <button
              type="button"
              class="create-form__tool-btn"
              :class="{ 'create-form__tool-btn--active': editorMode === 'preview' }"
              @click="editorMode = 'preview'"
            >
              预览
            </button>
          </div>
        </div>

        <div
          class="create-form__editor-body"
          :class="`create-form__editor-body--${editorMode}`"
        >
          <div v-if="editorMode !== 'preview'" class="create-form__editor-pane create-form__editor-pane--edit">
            <span v-if="editorMode === 'split'" class="create-form__pane-label">编辑</span>
            <textarea
              v-model="content"
              class="create-form__textarea create-form__textarea--content"
              placeholder="# 标题&#10;&#10;在这里编写 Markdown 正文..."
              spellcheck="false"
            />
          </div>

          <div v-if="editorMode !== 'edit'" class="create-form__editor-pane create-form__editor-pane--preview">
            <span v-if="editorMode === 'split'" class="create-form__pane-label">预览</span>
            <div
              class="create-form__preview markdown-body"
              v-html="renderedPreview"
            />
          </div>
        </div>
      </div>

      <p v-if="error" class="create-form__message create-form__message--error">
        {{ error }}
      </p>
      <p v-if="success" class="create-form__message create-form__message--success">
        {{ success }}
      </p>

      <div class="create-form__footer">
        <NuxtLink to="/admin/articles" class="create-form__cancel">
          取消
        </NuxtLink>
        <button type="submit" class="create-form__submit" :disabled="submitting">
          {{ submitting ? '发布中...' : '发布文章' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.create-form {
  padding: 1.5rem 1.65rem;
}

.create-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.create-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.create-form__field--full {
  grid-column: 1 / -1;
}

.create-form__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.create-form__input,
.create-form__textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 12px;
  background: rgb(255 255 255 / 80%);
  font: inherit;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.create-form__input:focus,
.create-form__textarea:focus {
  border-color: var(--home-accent);
  box-shadow: 0 0 0 3px rgb(20 184 166 / 15%);
}

.create-form__textarea {
  resize: vertical;
  line-height: 1.6;
}

.create-form__textarea--short {
  min-height: 5.5rem;
}

.create-form__editor {
  margin-top: 1.25rem;
}

.create-form__editor-body {
  display: grid;
  gap: 0.75rem;
}

.create-form__editor-body--edit {
  grid-template-columns: minmax(0, 1fr);
}

.create-form__editor-body--preview {
  grid-template-columns: minmax(0, 1fr);
}

.create-form__editor-body--split {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.create-form__editor-pane {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.create-form__pane-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
}

.create-form__editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.create-form__editor-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.create-form__file-input {
  display: none;
}

.create-form__tool-btn {
  padding: 0.45rem 0.85rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 999px;
  background: rgb(255 255 255 / 80%);
  color: #4b5563;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.create-form__tool-btn:hover,
.create-form__tool-btn--active {
  border-color: var(--home-accent);
  color: var(--home-accent-dark);
  background: var(--home-accent-pale);
}

.create-form__textarea--content {
  width: 100%;
  min-height: 22rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.7;
  resize: vertical;
}

.create-form__editor-body--split .create-form__textarea--content {
  min-height: 24rem;
  resize: none;
}

.create-form__preview {
  width: 100%;
  min-height: 22rem;
  overflow-y: auto;
  padding: 1rem 1.1rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 12px;
  background: rgb(255 255 255 / 80%);
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #374151;
}

.create-form__editor-body--split .create-form__preview {
  min-height: 24rem;
  max-height: none;
}

.create-form__preview :deep(h1),
.create-form__preview :deep(h2),
.create-form__preview :deep(h3) {
  margin: 1.25rem 0 0.65rem;
  color: #1a1a1a;
}

.create-form__preview :deep(p) {
  margin: 0 0 0.85rem;
}

.create-form__preview :deep(pre) {
  margin: 0.85rem 0;
  padding: 0.85rem;
  overflow-x: auto;
  border-radius: 10px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 0.8125rem;
}

.create-form__preview :deep(:not(pre) > code) {
  padding: 0.15em 0.35em;
  border-radius: 4px;
  background: #f3f4f6;
  font-family: var(--font-mono);
}

.create-form__message {
  margin: 1rem 0 0;
  font-size: 0.8125rem;
}

.create-form__message--error {
  color: #dc2626;
}

.create-form__message--success {
  color: var(--home-accent-dark);
}

.create-form__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgb(0 0 0 / 6%);
}

.create-form__cancel {
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
}

.create-form__cancel:hover {
  color: #374151;
}

.create-form__submit {
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 999px;
  background: var(--home-accent);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.create-form__submit:hover:not(:disabled) {
  background: var(--home-accent-dark);
}

.create-form__submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .create-form__grid {
    grid-template-columns: 1fr;
  }

  .create-form__editor-body--split {
    grid-template-columns: 1fr;
  }

  .create-form__editor-body--split .create-form__textarea--content,
  .create-form__editor-body--split .create-form__preview {
    min-height: 18rem;
  }
}
</style>
