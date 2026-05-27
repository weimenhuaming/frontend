import type { LoginEmailReq, LoginResp } from '#shared/types/auth'
import { proxyToBackend } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginEmailReq>(event)
  const { data, setCookies } = await proxyToBackend<LoginResp>('/emaillogin', {
    method: 'POST',
    body,
  })

  for (const cookie of setCookies) {
    appendHeader(event, 'set-cookie', cookie)
  }

  return data
})
