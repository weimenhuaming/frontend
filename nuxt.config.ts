// https://nuxt.com/docs/api/configuration/nuxt-config
const apiProxyTarget = process.env.NUXT_API_PROXY_TARGET || 'http://127.0.0.1:9000'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', '~/assets/css/admin.css'],

  modules: ['@pinia/nuxt'],

  /**
   * 开发时通过同源代理转发到 Go 后端，避免浏览器 CORS 预检（OPTIONS）被 405 拦截。
   * 生产环境若前后端分域部署，请设置 NUXT_PUBLIC_API_BASE 并确保后端正确处理 OPTIONS。
   */
  routeRules: {
    '/api/**': { proxy: `${apiProxyTarget}/**` },
    '/admin/categories': { redirect: '/admin' },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },
})
