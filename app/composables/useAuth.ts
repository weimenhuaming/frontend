import type { AuthUser, EmailResp, LoginResp } from '#shared/types/auth'

const STORAGE_USER = 'chenaqi_auth_user'
const STORAGE_TOKEN = 'chenaqi_access_token'

function toAuthUser(data: LoginResp['data']): AuthUser {
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

function isValidQqEmail(value: string) {
  return /^[^\s@]+@qq\.com$/i.test(value.trim())
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const accessToken = useState<string | null>('auth-token', () => null)
  const hydrated = useState('auth-hydrated', () => false)

  const isLoggedIn = computed(() => !!user.value && !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function persist(userData: AuthUser, token: string) {
    user.value = userData
    accessToken.value = token
    if (import.meta.client) {
      localStorage.setItem(STORAGE_USER, JSON.stringify(userData))
      localStorage.setItem(STORAGE_TOKEN, token)
    }
  }

  function hydrate() {
    if (hydrated.value || !import.meta.client)
      return

    const rawUser = localStorage.getItem(STORAGE_USER)
    const token = localStorage.getItem(STORAGE_TOKEN)

    if (rawUser && token) {
      try {
        user.value = JSON.parse(rawUser) as AuthUser
        accessToken.value = token
      }
      catch {
        clearLocal()
      }
    }

    hydrated.value = true
  }

  function clearLocal() {
    user.value = null
    accessToken.value = null
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_USER)
      localStorage.removeItem(STORAGE_TOKEN)
    }
  }

  async function sendEmailCode(email: string) {
    const emailValue = email.trim()
    if (!isValidQqEmail(emailValue))
      throw new Error('请输入有效的 QQ 邮箱（@qq.com）')

    const resp = await $fetch<EmailResp>('/api/auth/sendemail', {
      method: 'POST',
      body: { email: emailValue },
    })

    if (resp.code !== 200)
      throw new Error(resp.msg || '验证码发送失败')

    return resp
  }

  async function login(email: string, captcha: string) {
    const emailValue = email.trim()
    const captchaValue = captcha.trim()

    if (!isValidQqEmail(emailValue))
      throw new Error('请输入有效的 QQ 邮箱（@qq.com）')
    if (!/^\d{6}$/.test(captchaValue))
      throw new Error('请填写 6 位数字验证码')

    const resp = await $fetch<LoginResp>('/api/auth/emaillogin', {
      method: 'POST',
      body: { email: emailValue, captcha: captchaValue },
      credentials: 'include',
    })

    if (resp.code !== 200)
      throw new Error(resp.msg || '登录失败')

    const token = resp.data.access_token
    if (!token)
      throw new Error('登录响应缺少 access token')

    persist(toAuthUser(resp.data), token)
    return resp
  }

  async function logout() {
    if (accessToken.value) {
      try {
        await $fetch('/api/auth/logout', {
          method: 'GET',
          headers: { Authorization: accessToken.value },
          credentials: 'include',
        })
      }
      catch {
        // 即使后端失败也清除本地状态
      }
    }
    clearLocal()
  }

  function authHeaders(): Record<string, string> {
    return accessToken.value ? { Authorization: accessToken.value } : {}
  }

  return {
    user: readonly(user),
    accessToken: readonly(accessToken),
    isLoggedIn,
    isAdmin,
    hydrate,
    sendEmailCode,
    login,
    logout,
    authHeaders,
  }
}
