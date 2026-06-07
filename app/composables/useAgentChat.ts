import { createAgentSession, sendAgentChat } from '~/api/agent'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'chenaqi_agent_sessions'

function createId() {
  return crypto.randomUUID()
}

function loadSessions(): ChatSession[] {
  if (!import.meta.client)
    return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw)
      return []
    const parsed = JSON.parse(raw) as ChatSession[]
    return Array.isArray(parsed) ? parsed : []
  }
  catch {
    return []
  }
}

function saveSessions(sessions: ChatSession[]) {
  if (!import.meta.client)
    return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

function deriveTitle(messages: ChatMessage[]) {
  const firstUser = messages.find(message => message.role === 'user')
  if (!firstUser)
    return '新对话'
  const text = firstUser.content.trim()
  return text.length > 24 ? `${text.slice(0, 24)}…` : text
}

export function useAgentChat() {
  const auth = useAuth()
  const sessions = ref<ChatSession[]>([])
  const activeSessionId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref('')

  const activeSession = computed(() =>
    sessions.value.find(session => session.id === activeSessionId.value) ?? null,
  )

  const messages = computed(() => activeSession.value?.messages ?? [])

  function persist() {
    saveSessions(sessions.value)
  }

  function hydrate() {
    sessions.value = loadSessions()
    if (sessions.value.length > 0 && !activeSessionId.value)
      activeSessionId.value = sessions.value[0].id
  }

  async function createSession() {
    const localId = createId()
    const userId = auth.isLoggedIn.value
      ? String(auth.user.value?.id ?? 'guest')
      : 'guest'

    try {
      const data = await createAgentSession({
        session_id: localId,
        user_id: userId,
      })

      const session: ChatSession = {
        id: data.session_id,
        title: '新对话',
        messages: [],
        createdAt: data.created_at * 1000,
        updatedAt: Date.now(),
      }

      sessions.value = [session, ...sessions.value]
      activeSessionId.value = session.id
      error.value = ''
      persist()
      return session
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '创建会话失败'
      return null
    }
  }

  function selectSession(sessionId: string) {
    activeSessionId.value = sessionId
    error.value = ''
  }

  function deleteSession(sessionId: string) {
    sessions.value = sessions.value.filter(session => session.id !== sessionId)
    if (activeSessionId.value === sessionId)
      activeSessionId.value = sessions.value[0]?.id ?? null
    persist()
  }

  function updateSessionMessages(sessionId: string, updater: (messages: ChatMessage[]) => ChatMessage[]) {
    const index = sessions.value.findIndex(session => session.id === sessionId)
    if (index < 0)
      return

    const current = sessions.value[index]
    const nextMessages = updater(current.messages)
    sessions.value[index] = {
      ...current,
      messages: nextMessages,
      title: deriveTitle(nextMessages),
      updatedAt: Date.now(),
    }
    persist()
  }

  async function sendMessage(content: string) {
    const question = content.trim()
    if (!question || loading.value)
      return

    let session = activeSession.value
    if (!session) {
      session = await createSession()
      if (!session)
        return
    }

    const sessionId = session.id
    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: question,
      timestamp: Date.now(),
    }

    updateSessionMessages(sessionId, messages => [...messages, userMessage])
    loading.value = true
    error.value = ''

    try {
      const data = await sendAgentChat({
        session_id: sessionId,
        user_id: auth.isLoggedIn.value
          ? String(auth.user.value?.id ?? 'guest')
          : 'guest',
        question,
      })

      const assistantMessage: ChatMessage = {
        id: data.message_id,
        role: 'assistant',
        content: data.answer,
        timestamp: data.timestamp * 1000,
      }

      updateSessionMessages(sessionId, messages => [...messages, assistantMessage])
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '发送失败，请稍后重试'
      updateSessionMessages(sessionId, messages => messages.slice(0, -1))
    }
    finally {
      loading.value = false
    }
  }

  onMounted(() => {
    hydrate()
  })

  return {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    loading,
    error,
    hydrate,
    createSession,
    selectSession,
    deleteSession,
    sendMessage,
  }
}
