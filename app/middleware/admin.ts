/** 仅 admin 可访问：definePageMeta({ middleware: 'admin' }) */
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

  if (!auth.isAdmin.value) {
    return navigateTo('/')
  }
})
