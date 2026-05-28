import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

/** 认证状态（Pinia store 的便捷访问层，供中间件与布局组件使用） */
export function useAuth() {
  const store = useAuthStore()
  const { user, accessToken, isLoggedIn, isAdmin } = storeToRefs(store)

  return {
    user,
    accessToken,
    isLoggedIn,
    isAdmin,
    hydrate: () => store.hydrate(),
    logout: () => store.logout(),
    authHeaders: () => store.authHeaders(),
  }
}
