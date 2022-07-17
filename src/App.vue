<script setup>
const title = import.meta.env.VITE_NAME
const description = 'Le blog de l\'info'
useHead({
  title,
  meta: [
    { key: 'description', name: 'description', content: description },

    // open graph meta
    { key: 'og:description', name: 'og:description', content: description },
    { key: 'og:url', name: 'og:url', content: import.meta.env.VITE_HOSTNAME },
    { key: 'og:type:', name: 'og:type', content: 'website' },
    { key: 'og:title', name: 'og:title', content: title },
    { key: 'og:image', name: 'og:image', content: `${import.meta.env.VITE_HOSTNAME}/logo.png` },

    // twitter meta
    { key: 'twitter:description', name: 'twitter:description', content: description },
    { key: 'twitter:domain', name: 'twitter:domain', content: import.meta.env.VITE_NAME },
    { key: 'twitter:url', name: 'twitter:url', content: import.meta.env.VITE_HOSTNAME },
    { key: 'twitter:title', name: 'twitter:title', content: title },
    { key: 'twitter:image', name: 'twitter:image', content: `${import.meta.env.VITE_HOSTNAME}/logo.png` },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
  ],
})

useSchemaOrg([
  defineWebSite({ name: description }),
  defineWebPagePartial(),
])
</script>

<template>
  <suspense>
    <div class="flex text-secondary bg-primary dark:(text-primary bg-secondary)">
      <RouterView />
    </div>
  </suspense>
</template>
