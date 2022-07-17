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
  extendTheme: (theme) => {
    theme.colors.primary = theme.colors.light[100]
    theme.colors.secondary = theme.colors.gray[800]
  },
  shortcuts: [
    { invert: 'bg-secondary text-primary dark:(bg-primary text-secondary)' },
    { link: 'hover:invert rounded-sm !bg-opacity-40 transition-color duration-400' },
  ],
  safelist: ['i-clarity-success-standard-solid', 'i-mdi-content-copy', 'text-green-600'],
})
