import { defineStore } from 'pinia'
import { logout as logoutApi, type AuthUser, type LoginData } from '~/api/auth'
import { getUserProfile } from '~/api/user'

const STORAGE_USER = 'chenaqi_auth_user'
const STORAGE_TOKEN = 'chenaqi_access_token'
const STORAGE_REFRESH = 'chenaqi_refresh_token'

function normalizeLoginData(data: LoginData): LoginData {
  return {
    id: data.id ?? 0,
    name: data.name ?? '',
    phone: data.phone ?? '',
    email: data.email ?? '',
    uuid: data.uuid ?? '',
    avatar: data.avatar ?? '',
    role: data.role ?? 'user',
    sex: data.sex ?? '',
    age: data.age ?? 0,
    access_token: data.access_token ?? '',
    refresh_token: data.refresh_token ?? '',
  }
}

function toAuthUser(data: LoginData): AuthUser {
  const normalized = normalizeLoginData(data)
  return {
    id: normalized.id,
    name: normalized.name,
    phone: normalized.phone,
    email: normalized.email,
    uuid: normalized.uuid,
    avatar: normalized.avatar,
    role: normalized.role,
    sex: normalized.sex,
    age: normalized.age,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const hydrated = ref(false)

  const isLoggedIn = computed(() => !!user.value && !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function persistLocal() {
    if (!import.meta.client)
      return
    if (user.value)
      localStorage.setItem(STORAGE_USER, JSON.stringify(user.value))
    else
      localStorage.removeItem(STORAGE_USER)

    if (accessToken.value)
      localStorage.setItem(STORAGE_TOKEN, accessToken.value)
    else
      localStorage.removeItem(STORAGE_TOKEN)

    if (refreshToken.value)
      localStorage.setItem(STORAGE_REFRESH, refreshToken.value)
    else
      localStorage.removeItem(STORAGE_REFRESH)
  }

  function setSession(data: LoginData) {
    const normalized = normalizeLoginData(data)
    const token = normalized.access_token
    if (!token)
      throw new Error('登录响应缺少 access token')

    user.value = toAuthUser(normalized)
    accessToken.value = token
    refreshToken.value = normalized.refresh_token || null
    persistLocal()
  }

  function updateUser(data: Partial<AuthUser>) {
    if (!user.value)
      return
    user.value = { ...user.value, ...data }
    persistLocal()
  }

  function hydrate() {
    if (hydrated.value || !import.meta.client)
      return

    const rawUser = localStorage.getItem(STORAGE_USER)
    const token = localStorage.getItem(STORAGE_TOKEN)
    const refresh = localStorage.getItem(STORAGE_REFRESH)

    if (rawUser && token) {
      try {
        user.value = JSON.parse(rawUser) as AuthUser
        accessToken.value = token
        refreshToken.value = refresh
      }
      catch {
        clearSession()
      }
    }

    hydrated.value = true
  }

  async function syncProfile() {
    if (!import.meta.client || !accessToken.value)
      return

    try {
      const profile = await getUserProfile()
      updateUser(profile)
    }
    catch {
      // 忽略：token 失效时由业务页或中间件处理
    }
  }

  function clearSession() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    persistLocal()
  }

  async function logout() {
    if (accessToken.value) {
      try {
        await logoutApi()
      }
      catch {
        // 即使后端失败也清除本地状态
      }
    }
    clearSession()
  }

  function authHeaders(): Record<string, string> {
    return accessToken.value ? { Authorization: accessToken.value } : {}
  }

  return {
    user,
    accessToken,
    refreshToken,
    hydrated,
    isLoggedIn,
    isAdmin,
    setSession,
    updateUser,
    hydrate,
    syncProfile,
    clearSession,
    logout,
    authHeaders,
  }
})
