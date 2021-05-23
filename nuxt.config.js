import path from 'path'
import fs from 'fs'


const description = "Ce site a été entièrement réalisé par des passionnés d'informatique qui ont\
 pour vocation de transmettre leurs connaissances sur des sujets aussi précis que varié."

const hostname = 'https://flapili.fr'

const config = {
    messages: {
        error_404: "page non trouvée",
        server_error: "Oups",
        server_error_details: "Oups",
        client_error: "Oups",
        client_error_details: "Oups",
    },

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
        color: 'orange',
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
            { hid: 'og:image', property: "og:image", content: `${hostname}/logo.png` },

            // twitter tags
            { hid: 'twitter:description', property: 'twitter:description', content: description },
            { hid: 'twitter:domain', property: 'twitter:domain', content: 'flapili.fr' },
            { hid: 'twitter:url', property: 'twitter:url', content: hostname },
            { hid: 'twitter:title', property: 'twitter:title', content: 'Accueil - flapili.fr' },
            { hid: 'twitter:image', property: "twitter:image", content: `${hostname}/logo.png` },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ],
        script: [
            // { src: "/termynal.js/termynal.js" },
            // { src: "/termynal.js/termynal_addon.js", body: true },
        ],
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        'element-ui/lib/theme-chalk/index.css',

        '~/assets/css/styles.css',
        '~/assets/css/roboto.css',
        '~/assets/css/content.css',
        '~/assets/css/transition.css',
        '~/assets/css/termynal.css',
        '~/assets/css/termynal_addon.css',
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/menu-router-guard.js',
        '@/plugins/termynal.client.js',
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        '@nuxtjs/fontawesome',
        '@nuxtjs/google-analytics',
    ],
    
    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        '@nuxt/image',
        '@nuxt/content',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
    ],

    image: {
        provider: 'ipx',
    },

    googleAnalytics: {
        id: 'UA-183419207-1'
    },

    fontawesome: {
        icons: {
            solid: [
                'faExclamationTriangle',
                'faHome',
                'faSearch',
            ],
            regular: [
                'faClock',
            ],
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
        fullTextSearchFields: ['title', 'description', 'slug', 'text', 'tags', 'author.name'],
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
        // extractCSS: true,
        // hardSource: true,
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

// listen in all interfaces in dev mode 
if (process.env.NODE_ENV === "development") {
    config.server.host = '0.0.0.0';
}
config.server.host = '0.0.0.0';


export default config