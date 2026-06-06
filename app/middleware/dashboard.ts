import type { AuthUser, LoginData } from '~/api/auth'

/** 后台管理区：所有登录用户可访问（个人中心、点赞列表等） */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  if (import.meta.client) {
    auth.hydrate()
  }

  if (!auth.isLoggedIn.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }
})
