<script setup lang="ts">
export interface AdminSelectOption {
  value: string | number
  label: string
}

const props = withDefaults(defineProps<{
  modelValue: string | number | ''
  options: AdminSelectOption[]
  placeholder?: string
  searchable?: boolean
}>(), {
  placeholder: '请选择',
  searchable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | '']
}>()

const open = ref(false)
const search = ref('')
const rootRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const option = props.options.find(item => item.value === props.modelValue)
  return option?.label ?? ''
})

const showSearch = computed(() => props.searchable && props.options.length > 6)

const filteredOptions = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword)
    return props.options
  return props.options.filter(option => option.label.toLowerCase().includes(keyword))
})

function toggle() {
  open.value = !open.value
  if (!open.value)
    search.value = ''
}

function select(value: string | number) {
  emit('update:modelValue', value)
  open.value = false
  search.value = ''
}

function onClickOutside(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) {
    open.value = false
    search.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div
    ref="rootRef"
    class="admin-select"
    :class="{ 'admin-select--open': open }"
  >
    <button
      type="button"
      class="admin-select__trigger"
      :class="{ 'admin-select__trigger--placeholder': !selectedLabel }"
      @click="toggle"
    >
      <span class="admin-select__value">{{ selectedLabel || placeholder }}</span>
      <span class="admin-select__arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </button>

    <Transition name="admin-select-drop">
      <div v-if="open" class="admin-select__menu">
        <input
          v-if="showSearch"
          v-model="search"
          type="search"
          class="admin-select__search"
          placeholder="搜索分类..."
          @click.stop
        >

        <div v-if="filteredOptions.length" class="admin-select__grid">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            type="button"
            class="admin-select__chip"
            :class="{ 'admin-select__chip--active': option.value === modelValue }"
            @click="select(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <p v-else class="admin-select__empty">
          {{ options.length ? '没有匹配的分类' : '暂无可选项' }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.admin-select {
  position: relative;
  width: 100%;
}

.admin-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 12px;
  background: rgb(255 255 255 / 80%);
  color: #1a1a1a;
  font: inherit;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}

.admin-select__trigger:hover {
  border-color: rgb(20 184 166 / 35%);
  background: rgb(255 255 255 / 95%);
}

.admin-select--open .admin-select__trigger,
.admin-select__trigger:focus-visible {
  border-color: var(--home-accent, #14b8a6);
  box-shadow: 0 0 0 3px rgb(20 184 166 / 15%);
  outline: none;
}

.admin-select__trigger--placeholder .admin-select__value {
  color: #9ca3af;
}

.admin-select__value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-select__arrow {
  display: flex;
  flex-shrink: 0;
  color: #9ca3af;
  transition: transform 0.2s, color 0.15s;
}

.admin-select__arrow svg {
  width: 1rem;
  height: 1rem;
}

.admin-select--open .admin-select__arrow {
  transform: rotate(180deg);
  color: var(--home-accent-dark, #0d9488);
}

.admin-select__menu {
  position: absolute;
  z-index: 30;
  top: calc(100% + 0.35rem);
  left: 0;
  right: 0;
  min-width: 100%;
  padding: 0.65rem;
  border: 1px solid rgb(255 255 255 / 90%);
  border-radius: 14px;
  background: rgb(255 255 255 / 92%);
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 28px rgb(20 184 166 / 14%);
  max-height: 16rem;
  overflow-y: auto;
}

.admin-select__search {
  width: 100%;
  margin-bottom: 0.55rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 10px;
  background: rgb(255 255 255 / 90%);
  font-size: 0.8125rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.admin-select__search:focus {
  border-color: var(--home-accent, #14b8a6);
  box-shadow: 0 0 0 3px rgb(20 184 166 / 12%);
}

.admin-select__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.admin-select__chip {
  padding: 0.35rem 0.75rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 999px;
  background: rgb(255 255 255 / 85%);
  color: #4b5563;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.admin-select__chip:hover {
  border-color: rgb(20 184 166 / 35%);
  background: var(--home-accent-pale, #f0fdfa);
  color: var(--home-accent-dark, #0d9488);
}

.admin-select__chip--active {
  border-color: var(--home-accent, #14b8a6);
  background: var(--home-accent, #14b8a6);
  color: #fff;
  font-weight: 600;
}

.admin-select__chip--active:hover {
  background: var(--home-accent-dark, #0d9488);
  color: #fff;
}

.admin-select__empty {
  margin: 0;
  padding: 0.5rem 0.25rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.8125rem;
}

.admin-select-drop-enter-active,
.admin-select-drop-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.admin-select-drop-enter-from,
.admin-select-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
