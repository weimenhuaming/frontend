<script setup lang="ts">
import type { ChatSession } from '~/composables/useAgentChat'

defineProps<{
  sessions: ChatSession[]
  activeSessionId: string | null
  collapsed?: boolean
}>()

const emit = defineEmits<{
  create: []
  select: [sessionId: string]
  delete: [sessionId: string]
  toggle: []
}>()

function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <aside class="agent-sidebar" :class="{ 'agent-sidebar--collapsed': collapsed }">
    <div class="agent-sidebar__header">
      <NuxtLink to="/" class="agent-sidebar__brand" title="返回首页">
        <span class="agent-sidebar__logo" aria-hidden="true">✦</span>
        <span v-if="!collapsed" class="agent-sidebar__brand-text">站内助手</span>
      </NuxtLink>
      <button
        type="button"
        class="agent-sidebar__toggle"
        aria-label="切换侧边栏"
        @click="emit('toggle')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <button
      type="button"
      class="agent-sidebar__new"
      :class="{ 'agent-sidebar__new--icon': collapsed }"
      @click="emit('create')"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span v-if="!collapsed">新对话</span>
    </button>

    <div v-if="!collapsed" class="agent-sidebar__list">
      <p v-if="sessions.length === 0" class="agent-sidebar__empty">
        暂无对话记录
      </p>
      <button
        v-for="session in sessions"
        :key="session.id"
        type="button"
        class="agent-sidebar__item"
        :class="{ 'agent-sidebar__item--active': session.id === activeSessionId }"
        @click="emit('select', session.id)"
      >
        <span class="agent-sidebar__item-title">{{ session.title }}</span>
        <span class="agent-sidebar__item-time">{{ formatTime(session.updatedAt) }}</span>
        <span
          class="agent-sidebar__item-delete"
          role="button"
          tabindex="0"
          title="删除对话"
          @click.stop="emit('delete', session.id)"
          @keydown.enter.stop="emit('delete', session.id)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
          </svg>
        </span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.agent-sidebar {
  display: flex;
  flex-direction: column;
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  transition: width 0.25s ease, min-width 0.25s ease;
}

.agent-sidebar--collapsed {
  width: 64px;
  min-width: 64px;
}

.agent-sidebar--collapsed .agent-sidebar__header {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.45rem;
  padding: 0.85rem 0.5rem 0.65rem;
}

.agent-sidebar--collapsed .agent-sidebar__brand {
  justify-content: center;
}

.agent-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1rem 0.85rem 0.75rem;
}

.agent-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.agent-sidebar__logo {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 1rem;
  flex-shrink: 0;
}

.agent-sidebar__brand-text {
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
}

.agent-sidebar__toggle {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  flex-shrink: 0;
}

.agent-sidebar__toggle:hover {
  background: #f3f4f6;
  color: #374151;
}

.agent-sidebar__toggle svg {
  width: 1.1rem;
  height: 1.1rem;
}

.agent-sidebar__new {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0.75rem 0.85rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.agent-sidebar__new:hover {
  background: var(--home-accent-pale);
  border-color: var(--home-accent-light);
  color: var(--home-accent-dark);
}

.agent-sidebar__new--icon {
  width: 2rem;
  height: 2rem;
  margin: 0 auto 0.85rem;
  padding: 0;
  border-radius: 10px;
}

.agent-sidebar__new svg {
  width: 1rem;
  height: 1rem;
}

.agent-sidebar__list {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5rem 1rem;
}

.agent-sidebar__empty {
  margin: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.agent-sidebar__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  width: 100%;
  padding: 0.65rem 2rem 0.65rem 0.75rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}

.agent-sidebar__item:hover,
.agent-sidebar__item--active {
  background: #f3f4f6;
}

.agent-sidebar__item--active {
  background: var(--home-accent-pale);
}

.agent-sidebar__item-title {
  width: 100%;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.agent-sidebar__item-time {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.agent-sidebar__item-delete {
  position: absolute;
  right: 0.45rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  display: grid;
  place-items: center;
  border-radius: 6px;
  color: #9ca3af;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s, color 0.15s;
}

.agent-sidebar__item:hover .agent-sidebar__item-delete {
  opacity: 1;
}

.agent-sidebar__item-delete:hover {
  background: #fee2e2;
  color: #ef4444;
}

.agent-sidebar__item-delete svg {
  width: 0.85rem;
  height: 0.85rem;
}
</style>
