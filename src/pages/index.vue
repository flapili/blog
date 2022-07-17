<script setup>
const title = `Accueil - ${import.meta.env.VITE_NAME}`
useHead({
  title,
  meta: [
    // open graph meta
    { key: 'og:title', name: 'og:title', content: title },

    // twitter meta
    { key: 'twitter:title', name: 'twitter:title', content: title },
  ],
})
</script>

<template>
  <div class="flex w-full justify-center items-center relative w-full">
    <RouterLink to="/posts" class="absolute bg-secondary text-primary bg-opacity-95 text-2xl sm:text-4xl py-8 px-12 rounded-sm">
      Découvrir
    </RouterLink>
    <img src="/hero.jpg" alt="hero" class="w-full h-full object-cover">
  </div>
</template>
