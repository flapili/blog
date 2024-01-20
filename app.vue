<script setup>
const title = 'flapili.fr'
const host = 'flapili.fr'
const description = 'Le blog de l\'info'

useServerSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: `https://${host}/logo.png`,
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineWebSite({
    name: description,
  }),
  defineWebPage(),
])
</script>

<template>
  <div class="flex text-primary bg-secondary">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
