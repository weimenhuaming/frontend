// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    backendBase: process.env.NUXT_BACKEND_BASE || 'http://127.0.0.1:9000',
    public: {
      /** 前端统一走 Nuxt server/api 代理 */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },
})
