<script setup lang="ts">
import type { ChatMessage } from '~/composables/useAgentChat'
import { renderMarkdown } from '~/utils/markdown'

const props = defineProps<{
  message: ChatMessage
}>()

const renderedHtml = computed(() => {
  if (props.message.role !== 'assistant')
    return ''
  return renderMarkdown(props.message.content).html
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
      <p class="agent-message__role">
        {{ message.role === 'assistant' ? '站内助手' : '你' }}
      </p>
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

.agent-message__role {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
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
