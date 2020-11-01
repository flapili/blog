export default {

    server: {
        host: "0.0.0.0",
    },


    target: "static",


    vue: {
        config: {
            // devtools: true,
        },
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
            { hid: 'description', name: 'description', content: 'Le blog de flapili' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },


    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        'element-ui/lib/theme-chalk/index.css',
        '@fortawesome/fontawesome-svg-core/styles.css',

        '~/assets/css/styles.css',
        '~/assets/css/content.css',
        '~/assets/css/transition.css',
    ],


    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/fontawesome.js',
        '@/plugins/menu-router-guard.js',
    ],


    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,


    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/axios
        // '@nuxtjs/axios',
        // https://go.nuxtjs.dev/pwa
        // '@nuxtjs/pwa',
        // https://go.nuxtjs.dev/content
        '@nuxt/content',
        '@nuxtjs/dayjs',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
    ],


    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [],


    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {},


    // Content module configuration (https://go.nuxtjs.dev/content-config)
    content: {
        markdown: {
            prism: {
                theme: 'prism-themes/themes/prism-vs.css'
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
        hostname: 'https://flapili.fr',
        gzip: true,
        defaults: {
            // changefreq: 'daily',
            priority: 1,
            lastmod: new Date()
        },
    },

    // https://github.com/nuxt-community/robots-module
    robots: {
        UserAgent: '*',
        Allow: "/",
        Sitemap: "https://flapili.fr/sitemap.xml",
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
    },
}