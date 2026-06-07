<script setup lang="ts">
defineProps<{
  modelValue: string
  loading: boolean
  error?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function resizeTextarea() {
  const el = textareaRef.value
  if (!el)
    return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`
}

function onInput(event: Event) {
  const value = (event.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
  resizeTextarea()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    emit('submit')
  }
}

function focus() {
  textareaRef.value?.focus()
}

defineExpose({ focus, resizeTextarea })
</script>

<template>
  <div class="agent-composer">
    <p v-if="error" class="agent-composer__error" role="alert">
      {{ error }}
    </p>
    <form class="agent-composer__box" @submit.prevent="emit('submit')">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        class="agent-composer__input"
        rows="2"
        :placeholder="placeholder || '给站内助手发送消息'"
        :disabled="loading"
        @input="onInput"
        @keydown="onKeydown"
      />
      <div class="agent-composer__footer">
        <button
          type="submit"
          class="agent-composer__send"
          :disabled="loading || !modelValue.trim()"
          aria-label="发送"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </form>
    <p class="agent-composer__hint">
      回答基于站内知识库，仅供参考
    </p>
  </div>
</template>

<style scoped>
.agent-composer__error {
  margin: 0 0 0.5rem;
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.8125rem;
}

.agent-composer__box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  min-height: 7.5rem;
  padding: 1rem 1rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 4px 24px rgb(15 23 42 / 6%);
}

.agent-composer__input {
  flex: 1;
  width: 100%;
  min-height: 3rem;
  max-height: 10rem;
  padding: 0;
  border: none;
  resize: none;
  background: transparent;
  font: inherit;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #111827;
  outline: none;
}

.agent-composer__input::placeholder {
  color: #9ca3af;
}

.agent-composer__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.agent-composer__send {
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: var(--home-accent);
  color: #fff;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.agent-composer__send:hover:not(:disabled) {
  background: var(--home-accent-dark);
}

.agent-composer__send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.agent-composer__send svg {
  width: 1.1rem;
  height: 1.1rem;
}

.agent-composer__hint {
  margin: 0.55rem 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
}
</style>
