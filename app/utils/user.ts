import { resolveMediaUrl } from './media'

/** 解析用户头像 URL；无自定义头像时返回空字符串 */
export function resolveUserAvatar(
  avatar: string | undefined | null,
  _name = 'U',
  apiBase = '/api',
): string {
  const trimmed = avatar?.trim()
  if (!trimmed)
    return ''

  return resolveMediaUrl(trimmed, apiBase)
}

/** 取用户名首字母（大写）作为占位头像 */
export function getUserInitial(name?: string | null): string {
  return (name?.trim().charAt(0) || 'U').toUpperCase()
}

/** 角色展示文案 */
export function formatUserRole(role?: string | null): string {
  if (role === 'admin')
    return '管理员'
  if (role === 'user')
    return '用户'
  return role?.trim() || '用户'
}
