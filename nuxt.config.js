const appName = 'BundleDAO'
const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const host = baseUrl === 'http://localhost:3000'
  ? 'localhost'
  : '0'
const port = process.env.PORT
  ? Number.parseInt(process.env.PORT)
  : 3000
const arweaveConfig = {
  protocol: process.env.ARWEAVE_PROTOCOL || 'http',
  host: process.env.ARWEAVE_HOST || 'localhost',
  port: process.env.ARWEAVE_PORT
    ? Number.parseInt(process.env.ARWEAVE_PORT)
    : 1984
}
const gateway = baseUrl === 'http://localhost:3000'
  ? 'http://localhost:1984'
  : 'https://bundledao-demo.artby.city/arweave'

// const identityUrl = 'http://localhost:4201'
const identityUrl = 'https://identity.deso.org'
// const nodeUrl = 'http://localhost:3000/bundler'
const nodeUrl = 'http://localhost:1985'
const bundleDAOConfig = {
  nodeUrl,
  deso: {
    identityUrl,
    identityIframe: 'identity'
  }
}

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s`,
    title: appName,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  pageTransition: 'fade-transition',

  ssr: false,
  target: 'static',

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/deso.ts', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
    proxy: true
  },

  proxy: {},

  serverMiddleware: [],

  server: {
    host,
    port
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      default: 'light'
      // dark: true,
      // themes: {
      //   dark: {
      //     primary: colors.blue.darken2,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3,
      //   },
      // },
    },
  },

  publicRuntimeConfig: {
    baseUrl,
    eventName: appName,
    dapp: {
      name: appName,
      iconUrl: `${baseUrl}/favicon.ico`
    },
    arweave: {
      config: arweaveConfig,
      gateway: `${arweaveConfig.protocol}://${arweaveConfig.host}:${arweaveConfig.port}`
    },
    bundleDAOConfig,
    gateway,
    identityUrl
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      })
    }
  },
}
