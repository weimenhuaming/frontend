<script setup lang="ts">
import type { ChatMessage } from '~/composables/useAgentChat'
import { renderMarkdown } from '~/utils/markdown'

const props = defineProps<{
  message: ChatMessage
}>()

const copied = ref(false)

let copyTimer: ReturnType<typeof setTimeout> | null = null

const renderedHtml = computed(() => {
  if (props.message.role !== 'assistant')
    return ''
  return renderMarkdown(props.message.content).html
})

const canCopy = computed(() =>
  props.message.role === 'assistant'
  && !!props.message.content
  && !props.message.streaming,
)

async function copyContent() {
  if (!canCopy.value)
    return

  try {
    await navigator.clipboard.writeText(props.message.content)
    copied.value = true
    if (copyTimer)
      clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch {
    // ignore clipboard errors
  }
}

onUnmounted(() => {
  if (copyTimer)
    clearTimeout(copyTimer)
})
</script>

<template>
  <div
    class="agent-message"
    :class="`agent-message--${message.role}`"
  >
    <div class="agent-message__avatar" aria-hidden="true">
      <template v-if="message.role === 'assistant'">✦</template>
      <template v-else>我</template>
    </div>
    <div class="agent-message__body">
      <div class="agent-message__header">
        <p class="agent-message__role">
          {{ message.role === 'assistant' ? '站内助手' : '你' }}
        </p>
        <button
          v-if="canCopy"
          type="button"
          class="agent-message__copy"
          :class="{ 'agent-message__copy--done': copied }"
          :aria-label="copied ? '已复制' : '复制回复'"
          @click="copyContent"
        >
          <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>{{ copied ? '已复制' : '复制' }}</span>
        </button>
      </div>
      <div
        v-if="message.role === 'assistant'"
        class="agent-message__content markdown-body"
        :class="{ 'agent-message__content--streaming': message.streaming }"
        v-html="renderedHtml"
      />
      <p v-else class="agent-message__content agent-message__content--plain">
        {{ message.content }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.agent-message {
  display: flex;
  gap: 0.85rem;
  padding: 1.25rem 0;
}

.agent-message--user {
  flex-direction: row-reverse;
}

.agent-message__avatar {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

.agent-message--assistant .agent-message__avatar {
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
}

.agent-message--user .agent-message__avatar {
  background: #e5e7eb;
  color: #4b5563;
}

.agent-message__body {
  flex: 1;
  min-width: 0;
  max-width: 42rem;
}

.agent-message--user .agent-message__body {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.agent-message__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.agent-message__role {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.agent-message__copy {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.45rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #9ca3af;
  font-size: 0.6875rem;
  font-weight: 500;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s, background 0.15s;
}

.agent-message:hover .agent-message__copy,
.agent-message__copy:focus-visible {
  opacity: 1;
}

.agent-message__copy:hover {
  color: #4b5563;
  background: #f3f4f6;
}

.agent-message__copy--done {
  opacity: 1;
  color: var(--home-accent-dark);
}

.agent-message__copy svg {
  width: 0.875rem;
  height: 0.875rem;
}

.agent-message__content {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.75;
  color: #1f2937;
}

.agent-message__content--plain {
  padding: 0.75rem 1rem;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  white-space: pre-wrap;
  word-break: break-word;
}

.agent-message__content :deep(p) {
  margin: 0 0 0.75rem;
}

.agent-message__content :deep(p:last-child) {
  margin-bottom: 0;
}

.agent-message__content :deep(pre) {
  overflow-x: auto;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: #1e293b;
  color: #e2e8f0;
}

.agent-message__content :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
  font-size: inherit;
}

.agent-message__content :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85em;
}

.agent-message__content :deep(:not(pre) > code) {
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  background: #f3f4f6;
  color: #be185d;
}

.agent-message__content--streaming::after {
  content: '';
  display: inline-block;
  width: 0.4rem;
  height: 1em;
  margin-left: 0.15rem;
  vertical-align: text-bottom;
  background: var(--home-accent-dark, #6366f1);
  border-radius: 1px;
  animation: agent-cursor-blink 1s step-end infinite;
}

@keyframes agent-cursor-blink {
  0%, 100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>
