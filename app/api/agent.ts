import { request } from './http'

export interface CreateSessionRequest {
  session_id?: string
  user_id?: string
}

export interface CreateSessionData {
  session_id: string
  user_id: string
  created_at: number
  message: string
}

export interface AgentChatRequest {
  session_id: string
  user_id?: string
  question: string
}

export interface AgentChatStreamChunk {
  content?: string
  done: boolean
  session_id?: string
  message_id?: string
}

export interface AgentChatStreamOptions {
  onChunk: (chunk: AgentChatStreamChunk) => void
  signal?: AbortSignal
}

const TOKEN_KEY = 'chenaqi_access_token'

export function createAgentSession(body: CreateSessionRequest = {}) {
  return request<CreateSessionData>('/agent/session/create', {
    method: 'POST',
    body,
  })
}

function parseSSEBlock(block: string): AgentChatStreamChunk | null {
  const line = block.trim()
  if (!line.startsWith('data: '))
    return null
  return JSON.parse(line.slice(6)) as AgentChatStreamChunk
}

export async function sendAgentChatStream(
  body: AgentChatRequest,
  options: AgentChatStreamOptions,
): Promise<void> {
  const config = useRuntimeConfig()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (import.meta.client) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token)
      headers.Authorization = token
  }

  const resp = await fetch(`${config.public.apiBase}/agent/chat/stream`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(body),
    signal: options.signal,
  })

  if (!resp.ok) {
    let message = '请求失败'
    try {
      const json = await resp.json() as { msg?: string }
      message = json.msg || message
    }
    catch {
      // ignore non-JSON error body
    }
    throw new Error(message)
  }

  if (!resp.body)
    throw new Error('响应体为空')

  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done)
      break

    buffer += decoder.decode(value, { stream: true })
    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() ?? ''

    for (const block of blocks) {
      const chunk = parseSSEBlock(block)
      if (chunk)
        options.onChunk(chunk)
    }
  }

  if (buffer.trim()) {
    const chunk = parseSSEBlock(buffer)
    if (chunk)
      options.onChunk(chunk)
  }
}
