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
  extendTheme: (theme: any) => {
    theme.colors.primary = theme.colors.light[100]
    theme.colors.secondary = theme.colors.gray[800]
  },
  shortcuts: [
    { scrollable: 'scrollbar scrollbar-w-4px scrollbar-h-4px sm:(scrollbar-w-12px scrollbar-h-12px) scrollbar-thumb-color-green-700 scrollbar-track-color-secondary' },
    { invert: 'bg-primary text-secondary' },
    { link: 'hover:invert rounded-sm !bg-opacity-40 transition-color duration-400' },
  ],
  safelist: ['i-clarity-success-standard-solid', 'i-mdi-content-copy', 'text-green-600'],
})