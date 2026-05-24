export function getBackendBase(): string {
  const config = useRuntimeConfig()
  return config.backendBase
}

export async function proxyToBackend<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: unknown
    headers?: Record<string, string>
  } = {},
): Promise<{ data: T, setCookies: string[], authorization?: string | null }> {
  const backendBase = getBackendBase()
  const response = await $fetch.raw<T>(`${backendBase}${path}`, {
    method: options.method ?? 'GET',
    body: options.body,
    headers: options.headers,
  })

  const setCookies = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : (() => {
        const single = response.headers.get('set-cookie')
        return single ? [single] : []
      })()

  return {
    data: response._data as T,
    setCookies,
    authorization: response.headers.get('authorization'),
  }
}
