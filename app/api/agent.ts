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

export interface AgentChatData {
  session_id: string
  answer: string
  message_id: string
  timestamp: number
}

export function createAgentSession(body: CreateSessionRequest = {}) {
  return request<CreateSessionData>('/agent/session/create', {
    method: 'POST',
    body,
  })
}

export function sendAgentChat(body: AgentChatRequest) {
  return request<AgentChatData>('/agent/chat', {
    method: 'POST',
    body,
  })
}
