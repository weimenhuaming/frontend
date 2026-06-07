<script setup lang="ts">
definePageMeta({ layout: 'agent' })

useSeoMeta({ title: '站内助手 · Chenaqi Blog' })

const sidebarCollapsed = ref(false)

const {
  sessions,
  activeSessionId,
  messages,
  loading,
  error,
  createSession,
  selectSession,
  deleteSession,
  sendMessage,
} = useAgentChat()
</script>

<template>
  <div class="agent-page">
    <AgentSidebar
      :sessions="sessions"
      :active-session-id="activeSessionId"
      :collapsed="sidebarCollapsed"
      @create="createSession"
      @select="selectSession"
      @delete="deleteSession"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />
    <AgentChatPanel
      :messages="messages"
      :loading="loading"
      :error="error"
      @send="sendMessage"
    />
  </div>
</template>

<style scoped>
.agent-page {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.agent-page > :last-child {
  flex: 1;
  min-width: 0;
}
</style>
