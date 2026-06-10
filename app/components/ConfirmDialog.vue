<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  loading?: boolean
}>(), {
  title: '确认操作',
  confirmText: '确定',
  cancelText: '取消',
  danger: false,
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

function close() {
  if (props.loading)
    return
  emit('update:modelValue', false)
  emit('cancel')
}

function confirm() {
  if (props.loading)
    return
  emit('confirm')
}

function onKeydown(event: KeyboardEvent) {
  if (!props.modelValue)
    return
  if (event.key === 'Escape')
    close()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm-fade">
      <div
        v-if="modelValue"
        class="confirm-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'confirm-dialog-title' : undefined"
      >
        <button
          type="button"
          class="confirm-dialog__backdrop"
          aria-label="关闭"
          :disabled="loading"
          @click="close"
        />
        <div class="confirm-dialog__panel card">
          <h2 v-if="title" id="confirm-dialog-title" class="confirm-dialog__title">
            {{ title }}
          </h2>
          <p v-if="message || $slots.default" class="confirm-dialog__message">
            <slot>{{ message }}</slot>
          </p>
          <div class="confirm-dialog__actions">
            <button
              type="button"
              class="confirm-dialog__btn confirm-dialog__btn--cancel"
              :disabled="loading"
              @click="close"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="confirm-dialog__btn confirm-dialog__btn--confirm"
              :class="{ 'confirm-dialog__btn--danger': danger }"
              :disabled="loading"
              @click="confirm"
            >
              {{ loading ? '处理中…' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-dialog {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.confirm-dialog__backdrop {
  position: absolute;
  inset: 0;
  border: none;
  background: rgb(15 23 42 / 42%);
  backdrop-filter: blur(2px);
  cursor: pointer;
}

.confirm-dialog__panel {
  position: relative;
  width: min(100%, 24rem);
  padding: 1.35rem 1.5rem 1.25rem;
  box-shadow: 0 20px 50px rgb(15 23 42 / 18%);
}

.confirm-dialog__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}

.confirm-dialog__message {
  margin: 0.65rem 0 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: #4b5563;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.35rem;
}

.confirm-dialog__btn {
  padding: 0.55rem 1rem;
  border: none;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.confirm-dialog__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.confirm-dialog__btn--cancel {
  background: #f3f4f6;
  color: #374151;
}

.confirm-dialog__btn--cancel:hover:not(:disabled) {
  background: #e5e7eb;
}

.confirm-dialog__btn--confirm {
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  color: #fff;
}

.confirm-dialog__btn--confirm:hover:not(:disabled) {
  background: linear-gradient(135deg, #0d9488, #0f766e);
}

.confirm-dialog__btn--danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.confirm-dialog__btn--danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.18s ease;
}

.confirm-fade-enter-active .confirm-dialog__panel,
.confirm-fade-leave-active .confirm-dialog__panel {
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}

.confirm-fade-enter-from .confirm-dialog__panel,
.confirm-fade-leave-to .confirm-dialog__panel {
  opacity: 0;
  transform: scale(0.96) translateY(6px);
}
</style>
