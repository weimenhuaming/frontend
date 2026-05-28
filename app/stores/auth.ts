import { defineStore } from 'pinia'
import { logout as logoutApi, type AuthUser, type LoginData } from '~/api/auth'

const STORAGE_USER = 'chenaqi_auth_user'
const STORAGE_TOKEN = 'chenaqi_access_token'
const STORAGE_REFRESH = 'chenaqi_refresh_token'

function toAuthUser(data: LoginData): AuthUser {
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    uuid: data.uuid,
    avatar: data.avatar,
    role: data.role,
    sex: data.sex,
    age: data.age,
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
    const token = data.access_token
    if (!token)
      throw new Error('登录响应缺少 access token')

    user.value = toAuthUser(data)
    accessToken.value = token
    refreshToken.value = data.refresh_token || null
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
    hydrate,
    clearSession,
    logout,
    authHeaders,
  }
})
