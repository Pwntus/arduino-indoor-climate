export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: 'vercel'
  },
  sourcemap: {
    server: false,
    client: false
  },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: `Indoor Climate - Taavinkuja 5 A 1`,
      link: [
        { rel: 'canonical', href: '' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      meta: [
        { hid: 'charset', charset: 'utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        {
          hid: 'viewport',
          name: 'viewport',
          content:
            'width=device-width,height=device-height,initial-scale=1.0,user-scalable=0,minimum-scale=1.0,maximum-scale=1.0,viewport-fit=cover'
        },
        {
          hid: 'format-detection',
          name: 'format-detection',
          content: 'telephone=no'
        },
        { hid: 'author', name: 'author', content: 'Pontus Aurdal' },
        {
          hid: 'description',
          name: 'description',
          content:
            'Monitor the indoor climate in real time at Taavinkuja 5 A 1.'
        },
        {
          hid: 'og:type',
          name: 'og:type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'og:url',
          name: 'og:url',
          property: 'og:url',
          content: 'https://arduino-indoor-climate.vercel.app/'
        },
        {
          hid: 'og:site_name',
          name: 'og:site_name',
          property: 'og:site_name',
          content: 'arduino-indoor-climate.vercel.app'
        },
        {
          hid: 'og:title',
          name: 'og:title',
          property: 'og:title',
          content: 'Indoor Climate - Taavinkuja 5 A 1'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          property: 'og:description',
          content:
            'Monitor the indoor climate in real time at Taavinkuja 5 A 1.'
        },
        {
          hid: 'og:image',
          name: 'og:image',
          property: 'og:image',
          content: 'https://arduino-indoor-climate.vercel.app/cover.jpg'
        },
        {
          hid: 'msapplication-TileColor',
          name: 'msapplication-TileColor',
          content: '#ffffff'
        },
        { hid: 'theme-color', name: 'theme-color', content: '#ffffff' },
        {
          hid: 'mobile-web-app-capable',
          name: 'mobile-web-app-capable',
          content: 'yes'
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: 'arduino-indoor-climate.vercel.app'
        }
      ],
      script: [],
      style: []
    }
  }
})
