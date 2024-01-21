<script setup>
const title = 'Accueil - flapili.fr'

useServerSeoMeta({
  title,
  ogTitle: title,
})
</script>

<template>
  <div class="flex w-full justify-center items-center relative w-full">
    <NuxtLink to="/posts" class="absolute bg-secondary text-primary bg-opacity-95 text-2xl sm:text-4xl py-8 px-12 rounded-sm">
      Découvrir
    </NuxtLink>
    <img src="/hero.jpg" alt="hero" class="w-full h-full object-cover">
  </div>
</template>
