<script setup lang="ts">
const year = useDateFormat(useNow(), 'YYYY')
</script>

<template>
  <div class="min-h-screen min-w-screen flex flex-col">
    <div class="flex w-full my-8 items-center">
      <NuxtLink class="hidden sm:block text-3xl pl-8" to="/">
        flapili.fr
      </NuxtLink>
      <nav class="ml-auto mr-auto sm:(mr-8 text-xl) flex flex-wrap items-center children:(px-4 py-2 h-full)">
        <NuxtLink to="/" class="link flex justify-center items-center flex-gap-1">
          <i class="i-material-symbols-folder-open-outline" />
          <div>
            Articles
          </div>
        </NuxtLink>
        <NuxtLink to="/team" class="link">
          L'équipe
        </NuxtLink>
      </nav>
    </div>
    <main class="h-full w-full flex justify-center flex-grow">
      <slot />
    </main>
    <footer class="border-t-1px flex flex-col justify-center items-center py-4 flex-gap-2">
      <div class="flex children:p-2 flex-gap-4 text-3xl">
        <a href="https://discord.flapili.fr" target="_blank" rel="noreferrer" class="link flex justify-center">
          <i class="i-mdi-discord" />
        </a>
        <a href="https://github.com/flapili/blog" target="_blank" rel="noreferrer" class="link flex justify-center">
          <i class="i-mdi-github" />
        </a>
      </div>
      <div class="flex">
        <div class="i-mdi-creative-commons mt-0.5 mr-1" /> {{ year }} flapili.fr
      </div>
    </footer>
  </div>
</template>
