<script setup lang="ts">
const year = useDateFormat(useNow(), 'YYYY')
</script>

<template>
  <div class="min-h-screen min-w-screen flex flex-col">
    <div class="my-8 w-full flex items-center">
      <NuxtLink class="hidden pl-8 text-3xl sm:block" to="/">
        flapili.fr
      </NuxtLink>
      <nav class="ml-auto mr-auto flex flex-wrap items-center rounded-md ring-inset sm:(mr-8 text-xl) children:(h-full px-4 py-2 text-primary ring-green-700)">
        <NuxtLink to="/" class="flex items-center justify-center flex-gap-1 hover:(bg-green-900 ring-2)">
          <i class="i-material-symbols-folder-open-outline" />
          <div>
            Articles
          </div>
        </NuxtLink>
        <NuxtLink to="/team" class="flex items-center justify-center flex-gap-1 hover:(bg-green-900 ring-2)">
          L'équipe
        </NuxtLink>
      </nav>
    </div>
    <main class="h-full w-full flex flex-grow justify-center">
      <slot />
    </main>
    <footer class="flex flex-col items-center justify-center flex-gap-2 border-t-1px py-4">
      <div class="flex flex-gap-4 text-3xl children:p-2">
        <a href="https://discord.flapili.fr" target="_blank" rel="noreferrer" class="flex justify-center link">
          <i class="i-mdi-discord" />
        </a>
        <a href="https://github.com/flapili/blog" target="_blank" rel="noreferrer" class="flex justify-center link">
          <i class="i-mdi-github" />
        </a>
      </div>
      <div class="flex">
        <div class="i-mdi-creative-commons mr-1 mt-0.5" /> {{ year }} flapili.fr
      </div>
    </footer>
  </div>
</template>
