import type { LogoutResp } from '../../types/auth'
import { proxyToBackend } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, 'authorization')
  const cookie = getHeader(event, 'cookie')

  const { data, setCookies } = await proxyToBackend<LogoutResp>('/logout', {
    method: 'GET',
    headers: {
      ...(authorization ? { Authorization: authorization } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
  })

  for (const cookieHeader of setCookies) {
    appendHeader(event, 'set-cookie', cookieHeader)
  }

  return data
})
