// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: ['@pinia/nuxt'],

  runtimeConfig: {
    public: {
      /** 前后端分离：直接请求 Go 后端 */
      apiBase: 'http://127.0.0.1:9000',
    },
  },
})
