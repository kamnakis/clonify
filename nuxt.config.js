require('dotenv').config()

export default {
  server: {
    port: 8080,
    host: '0.0.0.0'
  },

  target: 'static',

  router: { base: '/clonify/' },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Clonify',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=0' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'theme-color', content: '#242424' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/composition-api',
    '~/plugins/axios'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/vuetify',
    '@nuxtjs/fontawesome',
    '@nuxtjs/pwa'
  ],

  fontawesome: {
    component: 'fa',
    suffix: true,
    icons: {
      solid: [
        'faPlay',
        'faPause',
        'faStop',
        'faPlayCircle',
        'faSignOutAlt',
        'faStepForward',
        'faStepBackward',
        'faChevronLeft',
        'faEllipsisH',
        'faHeart',
        'faTimes',
        'faVolumeUp',
        'faDoorOpen',
        'faPlus'
      ],
      regular: [
        'faHeart'
      ],
      light: [],
      duotone: [],
      brands: []
    }
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/auth'
  ],

  pwa: {
    icon: false // disables the icon module
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.NODE_ENV === 'production' ? process.env.API_AUTH_URL : 'http://127.0.0.1:1337',
    progress: false
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: {
      ignoreOrder: false
    }
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'auth/local',
            method: 'post',
            propertyName: 'jwt'
          },
          user: {
            url: 'users/me',
            method: 'get',
            propertyName: false
          },
          logout: false
        }
      }
    },
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/'
    }
  }
}
