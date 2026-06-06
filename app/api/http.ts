type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/** 项目 API 实际会用到的请求选项（避免与 Nitro $fetch 类型冲突） */
export interface RequestOptions {
  method?: HttpMethod
  body?: object | BodyInit | null
  query?: Record<string, unknown>
  headers?: Record<string, string>
}

const TOKEN_KEY = 'chenaqi_access_token'

interface ApiResponseData<T = unknown> {
  code: number
  msg: string
  data?: T
}

interface LoginPayload {
  access_token?: string
  refresh_token?: string
}

/** 登录接口：解析 body 与 Authorization 响应头中的 access token */
export async function postLogin<T extends LoginPayload>(
  path: string,
  body: object,
): Promise<T> {
  const config = useRuntimeConfig()

  const res = await $fetch.raw<ApiResponseData<T>>(path, {
    baseURL: config.public.apiBase,
    credentials: 'include',
    method: 'POST',
    body,
  })

  const payload = res._data
  if (!payload || payload.code !== 200)
    throw new Error(payload?.msg || '登录失败')

  const data = payload.data
  if (!data)
    throw new Error('登录响应缺少用户数据')

  if (!data.access_token) {
    const headerToken = res.headers.get('authorization')
    if (headerToken)
      data.access_token = headerToken
  }

  return data
}

/**
 * 封装 $fetch：拼接后端 baseURL、附带 Authorization、解析 { code, msg, data } 包装
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const config = useRuntimeConfig()

  const headers: Record<string, string> = {
    ...options.headers,
  }

  if (import.meta.client) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token)
      headers.Authorization = token
  }

  const res = await $fetch<ApiResponseData<T>>(path, {
    baseURL: config.public.apiBase,
    credentials: 'include',
    method: options.method,
    body: options.body,
    query: options.query,
    headers,
  })

  if (res.code !== 200)
    throw new Error(res.msg || '请求失败')

  return res.data as T
}
