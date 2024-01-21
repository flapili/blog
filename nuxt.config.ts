// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  experimental: {
    viewTransition: true,
  },

  devtools: {
    enabled: true,
  },

  nitro: {
    preset: 'netlify-static',
  },

  modules: [
    '@nuxt/content',
    '@vueuse/nuxt',
    '@unocss/nuxt',
  ],

  content: {},

  css: [
    '@unocss/reset/tailwind.css',
    '@/assets/css/main.css',
  ],
})
