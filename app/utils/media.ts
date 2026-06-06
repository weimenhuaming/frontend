/** 将 gateway 本地静态资源路径转为前端可访问 URL */
export function resolveMediaUrl(url: string | undefined | null, apiBase = '/api'): string {
  const trimmed = url?.trim()
  if (!trimmed)
    return ''

  // Base64 或完整 URL 直接使用（兼容旧数据）
  if (trimmed.startsWith('data:') || /^https?:\/\//i.test(trimmed))
    return trimmed

  const base = apiBase.replace(/\/$/, '')
  if (trimmed.startsWith('/static/'))
    return `${base}${trimmed}`

  if (trimmed.startsWith('static/'))
    return `${base}/${trimmed}`

  return trimmed
}
