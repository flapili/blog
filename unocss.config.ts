import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
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
  shortcuts: [
    { invert: 'bg-gray-800 text-gray-300 dark:(bg-light-100 text-gray-800)' },
    { link: 'hover:invert rounded-sm !bg-opacity-40 transition-color duration-400' },
  ],
  safelist: ['i-clarity-success-standard-solid', 'i-mdi-content-copy', 'text-green-600'],
})
