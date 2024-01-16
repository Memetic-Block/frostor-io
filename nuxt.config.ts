// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  ssr: false,

  app: {
    baseURL: '/',
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'Description',
          content: 'Frostor website'
        }
      ],
      title: 'Frostor',
      link: [{
        rel: 'icon',
        type: 'image/png',
        href: '/favicon.ico'
      }]
    }
  },

  experimental: {
    writeEarlyHints: false
  },

  /**
   * Vuetify Config
   * See https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
   * See https://pictogrammers.github.io/@mdi/font/7.1.96/
   */
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false
    },
  },

  /**
   * Vue Router Config
   */
  pages: true
})
