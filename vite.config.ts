import path from 'path'
import fs from 'fs'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { SchemaOrgResolver, schemaOrgAutoImports } from '@vueuse/schema-org-vite'
import Unocss from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import Markdown from 'vite-plugin-vue-markdown'
import MarkdownItPrism from 'markdown-it-prism'
import MarkdownItLinkAttributes from 'markdown-it-link-attributes'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItCopy from 'markdown-it-copy'
import MarkdownItTableOfContents from 'markdown-it-table-of-contents'
import MarkdownItNamedCodeBlocks from 'markdown-it-named-code-blocks'

import FrontMater from 'front-matter'

export default (mode: string) => {
  const env = Object.assign({}, process.env, loadEnv(mode, process.cwd()))
  return defineConfig({
    resolve: {
      alias: {
        '~/': `${path.resolve('src')}/`,
        '@/': `${path.resolve()}/`,
      },
    },

    plugins: [
      Vue({
        include: [/\.vue$/, /\.md$/],
        reactivityTransform: true,
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ['vue', 'md'],
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          schemaOrgAutoImports,
          'vue',
          'vue-router',
          'vue/macros',
          '@vueuse/head',
          '@vueuse/core',
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: [
          'src/composables',
          'src/store',
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
        directoryAsNamespace: true,
        resolvers: [
          SchemaOrgResolver(),
        ],
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss(),

      // https://github.com/antfu/vite-plugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: 'markdown',
        markdownItSetup(md) {
          // https://prismjs.com/
          md.use(MarkdownItPrism)
          md.use(MarkdownItNamedCodeBlocks)
          md.use((md) => {
            const defaultRender = md.renderer.rules.fence
            md.renderer.rules.fence = (...args) => `
              <div style="position:relative; margin-left:0.5rem; margin-right:0.5rem; padding-top:2rem">
                ${defaultRender?.(...args)}
              </div>`
          })
          md.use(MarkdownItAnchor, {
            permalink: MarkdownItAnchor.permalink.linkInsideHeader({ placement: 'before' }),
          })
          md.use(MarkdownItTableOfContents, {
            includeLevel: [1, 2, 3, 4],
          })
          md.use(MarkdownItLinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link), attrs: { target: '_blank', rel: 'noopener' },
          })
          md.use(MarkdownItCopy, {
            btnText: '<div class="i-mdi-content-copy" />',
            successText: '<div class="i-clarity-success-standard-solid text-green-600" />',
          })
        },
      }),

      // https://github.com/antfu/vite-plugin-inspect
      // Visit http://localhost:3333/__inspect/ to see the inspector
      Inspect(),
    ],

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      onFinished() {
        generateSitemap({
          hostname: env.VITE_HOSTNAME,
          exclude: ['/404'],
        })
      },
      includedRoutes() {
        return [
          '/',
          '/posts',
          '/team',

          // all not archived posts
          ...fs.readdirSync(path.resolve('content', 'posts'))
            .filter(r => path.parse(r).ext === '.md')
            .filter((r) => {
              const fileContent = fs.readFileSync(path.resolve('content', 'posts', r)).toString()
              return FrontMater(fileContent).attributes.archived !== true
            })
            .map(r => `/posts/${path.parse(r).name}`),

          // all active member
          ...fs.readdirSync(path.resolve('content', 'team'))
            .filter(r => path.parse(r).ext === '.md')
            .filter((r) => {
              const fileContent = fs.readFileSync(path.resolve('content', 'team', r)).toString()
              return FrontMater(fileContent).attributes.archived !== true
            })
            .map(r => `/team/${path.parse(r).name}`),

          // fallback for netlify
          '/404',
        ]
      },
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ['workbox-window'],
    },
  })
}

