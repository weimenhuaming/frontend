<script setup lang="ts">
import type { ChatMessage } from '~/composables/useAgentChat'

const props = defineProps<{
  messages: ChatMessage[]
  loading: boolean
  error: string
}>()

const emit = defineEmits<{
  send: [content: string]
}>()

const input = ref('')
const messagesEnd = ref<HTMLElement | null>(null)
const composerRef = ref<{ focus: () => void, resizeTextarea: () => void } | null>(null)

const suggestions = [
  '博客有哪些技术文章？',
  '介绍一下这个网站',
  '最近写了什么内容？',
  '如何联系作者？',
]

const isEmpty = computed(() => props.messages.length === 0 && !props.loading)

function submit() {
  const content = input.value.trim()
  if (!content || props.loading)
    return
  emit('send', content)
  input.value = ''
  nextTick(() => {
    composerRef.value?.resizeTextarea()
  })
}

function useSuggestion(text: string) {
  input.value = text
  nextTick(() => {
    composerRef.value?.resizeTextarea()
    composerRef.value?.focus()
  })
}

watch(() => props.messages.length, () => {
  nextTick(() => {
    messagesEnd.value?.scrollIntoView({ behavior: 'smooth' })
  })
})

watch(() => props.loading, () => {
  nextTick(() => {
    messagesEnd.value?.scrollIntoView({ behavior: 'smooth' })
  })
})
</script>

<template>
  <section class="agent-chat" :class="{ 'agent-chat--empty': isEmpty }">
    <template v-if="isEmpty">
      <div class="agent-chat__empty">
        <div class="agent-chat__inner">
          <div class="agent-chat__welcome">
            <div class="agent-chat__welcome-icon" aria-hidden="true">✦</div>
            <h1 class="agent-chat__welcome-title">你好，我是站内助手</h1>
            <p class="agent-chat__welcome-desc">
              基于个人知识库的智能问答，可以帮你了解博客内容、网站信息与创作相关话题。
            </p>
          </div>

          <AgentComposer
            ref="composerRef"
            v-model="input"
            :loading="loading"
            :error="error"
            @submit="submit"
          />

          <div class="agent-chat__suggestions">
            <button
              v-for="item in suggestions"
              :key="item"
              type="button"
              class="agent-chat__suggestion"
              @click="useSuggestion(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="agent-chat__messages">
        <div class="agent-chat__inner">
          <AgentMessage
            v-for="message in messages"
            :key="message.id"
            :message="message"
          />
          <div v-if="loading" class="agent-chat__typing">
            <span class="agent-chat__typing-dot" />
            <span class="agent-chat__typing-dot" />
            <span class="agent-chat__typing-dot" />
          </div>
          <div ref="messagesEnd" />
        </div>
      </div>

      <div class="agent-chat__composer-wrap">
        <div class="agent-chat__inner">
          <AgentComposer
            ref="composerRef"
            v-model="input"
            :loading="loading"
            :error="error"
            @submit="submit"
          />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.agent-chat {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  min-width: 0;
  background: #f7f8fa;
}

.agent-chat__inner {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
}

.agent-chat--empty {
  justify-content: center;
}

.agent-chat__empty {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2rem 1.5rem;
  margin-top: -6vh;
}

.agent-chat__welcome {
  margin-bottom: 1.5rem;
  text-align: center;
}

.agent-chat__welcome-icon {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1.25rem;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 1.5rem;
}

.agent-chat__welcome-title {
  margin: 0 0 0.65rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
}

.agent-chat__welcome-desc {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #6b7280;
}

.agent-chat__suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  max-width: 26rem;
  margin: 1.25rem auto 0;
}

.agent-chat__suggestion {
  padding: 0.55rem 0.95rem;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fff;
  color: #374151;
  font-size: 0.8125rem;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.agent-chat__suggestion:hover {
  border-color: var(--home-accent-light);
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
}

.agent-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.5rem 1rem;
  scrollbar-gutter: stable;
}

.agent-chat__typing {
  display: flex;
  gap: 0.35rem;
  padding: 0.5rem 0 0 2.85rem;
}

.agent-chat__typing-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #9ca3af;
  animation: agent-typing 1.2s infinite ease-in-out;
}

.agent-chat__typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.agent-chat__typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes agent-typing {
  0%, 80%, 100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.agent-chat__composer-wrap {
  padding: 0 1.5rem 2rem;
}

@media (max-width: 768px) {
  .agent-chat__empty {
    margin-top: 0;
    padding: 1.5rem 1rem;
  }

  .agent-chat__suggestions {
    max-width: 100%;
  }

  .agent-chat__suggestion {
    white-space: normal;
  }

  .agent-chat__composer-wrap {
    padding-bottom: 1.25rem;
  }
}
</style>
