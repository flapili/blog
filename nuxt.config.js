import path from 'path'
import fs from 'fs'


const description = "Ce site a été entièrement réalisé par des passionnés d'informatique qui ont\
 pour vocation de transmettre leurs connaissances sur des sujets aussi précis que variés. Cette\
 équipe de rédacteurs et de designers est à votre écoute pour toute idée sur le fonctionnement du\
 site. Le projet étant Open Source il est consultable depuis Github."

const hostname = 'https://flapili.fr'

const config = {

    server: {
        port: process.env.NODE_ENV === "development" ? 8080 : 4443,
    },

    modern: true,

    render: {
        http2: {
            push: true,
        },
    },

    target: "server",

    loading: {
        color: 'blue',
        height: '3px',
        continuous: true,
        duration: 1000,
    },

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        htmlAttrs: {
            lang: 'fr',
        },
        title: 'flapili.fr',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', property: 'description', content: description },

            // Open Graph tags
            { hid: 'og:description', property: 'og:description', content: description },
            { hid: 'og:url', property: 'og:url', content: hostname },
            { hid: 'og:type', property: 'og:type', content: 'website' },
            { hid: 'og:title', property: 'og:title', content: 'Accueil - flapili.fr' },
            { hid: 'og:image', property: "og:image", content: `${hostname}/logo.webp` },

            // twitter tags
            { hid: 'twitter:description', property: 'twitter:description', content: description },
            { hid: 'twitter:domain', property: 'twitter:domain', content: 'flapili.fr' },
            { hid: 'twitter:url', property: 'twitter:url', content: hostname },
            { hid: 'twitter:title', property: 'twitter:title', content: 'Accueil - flapili.fr' },
            { hid: 'twitter:image', property: "twitter:image", content: `${hostname}/logo.webp` },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        'element-ui/lib/theme-chalk/index.css',

        '~/assets/css/styles.css',
        '~/assets/css/content.css',
        '~/assets/css/transition.css',
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/menu-router-guard.js',
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        '@nuxtjs/fontawesome',
    ],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // https://go.nuxtjs.dev/content
        '@nuxt/content',
        '@nuxtjs/dayjs',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
    ],

    fontawesome: {
        icons: {
            solid: [
                'faExclamationTriangle',
            ],
            regular: [],
            light: [],
            duotone: [],
            brands: [
                'faDiscord',
                'faGithub',

            ],
        }
    },
    // Content module configuration (https://go.nuxtjs.dev/content-config)
    content: {
        liveEdit: false,
        markdown: {
            prism: {
                theme: 'prism-themes/themes/prism-vsc-dark-plus.css'
            }
        },
        fullTextSearchFields: ['title', 'description', 'slug', 'text', 'tags'],
        nestedProperties: [
            "author.name",
            "author.avatar",
            "author.website_url",
        ],
    },

    // https://github.com/nuxt-community/sitemap-module
    sitemap: {
        hostname: hostname,
        gzip: true,
        defaults: {
            priority: 1,
            lastmod: new Date()
        },
    },

    // https://github.com/nuxt-community/robots-module
    robots: {
        UserAgent: '*',
        Allow: "/",
        Sitemap: `${hostname}/sitemap.xml`,
    },

    generate: {
        async routes() {
            const { $content } = require('@nuxt/content')
            const files = await $content("posts").only(['path']).fetch()

            return files.map(file => file.path === '/index' ? '/' : file.path)
        }
    },

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        transpile: [/^element-ui/],
        hardSource: true,
        cache: true,
    },
}

// only serve https in production
if (process.env.NODE_ENV === "production") {
    config.server.https = {
        key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
    }
}

export default config