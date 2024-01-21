// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

import { presetIcons, presetTypography, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  nitro: {
    preset: 'netlify-static',
  },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@unocss/nuxt',
  ],

  content: {
    // documentDriven: {
    //   injectPage: false,
    //   layoutFallbacks: ['Default'],
    //   trailingSlash: false,
    // },
  },

  css: [
    '@unocss/reset/tailwind.css',
    '@/assets/css/main.css',
  ],
  unocss: {
    presets: [
      presetUno(),
      presetIcons({
        scale: 1.2,
        warn: true,
      }),
      presetTypography(),
      presetWebFonts({
        fonts: {
          sans: 'DM Sans',
          serif: 'DM Serif Display',
          mono: 'DM Mono',
        },
      }),
      presetScrollbar(),
    ],
    transformers: [
      transformerDirectives(),
      transformerVariantGroup(),
    ],
    extendTheme: (theme: any) => {
      theme.colors.primary = theme.colors.light[100]
      theme.colors.secondary = theme.colors.gray[800]
    },
    shortcuts: [
      { scrollable: 'scrollbar scrollbar-w-4px scrollbar-h-4px sm:(scrollbar-w-12px scrollbar-h-12px) scrollbar-thumb-color-primary scrollbar-track-color-secondary' },
      { invert: 'bg-primary text-secondary' },
      { link: 'hover:invert rounded-sm !bg-opacity-40 transition-color duration-400' },
    ],
    safelist: ['i-clarity-success-standard-solid', 'i-mdi-content-copy', 'text-green-600'],

  },
})
