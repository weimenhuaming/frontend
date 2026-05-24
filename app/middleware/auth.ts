/** 需要登录的页面使用：definePageMeta({ middleware: 'auth' }) */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  if (import.meta.server) {
    return
  }

  auth.hydrate()

  if (!auth.isLoggedIn.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }
})
