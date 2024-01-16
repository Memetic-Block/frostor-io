import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        dark: {
          colors: {
            primary: '#C82323',
            secondary: '#df2626',
            'gray-text': '#999999',
            surface: '#333333',
            background: '#222222',
            'chalk-background': '#E1E1E1',
            'off-white': '#F8F8F8',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
          }
        }
      }
    }
  })
  nuxtApp.vueApp.use(vuetify)
})
