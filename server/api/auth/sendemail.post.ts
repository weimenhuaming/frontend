import type { EmailReq, EmailResp } from '../../types/auth'
import { proxyToBackend } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const body = await readBody<EmailReq>(event)
  const { data } = await proxyToBackend<EmailResp>('/sendemail', {
    method: 'POST',
    body,
  })
  return data
})
