<script setup>
const description = 'Le blog de l\'info'
useHead({
  title: 'flapili.fr',
  meta: [
    { name: 'description', content: description },
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
    <div class="flex text-gray-800 bg-light-100 dark:(text-gray-300 bg-gray-800)">
      <RouterView />
    </div>
  </suspense>
</template>
