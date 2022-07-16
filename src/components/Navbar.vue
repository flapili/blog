<template>
  <nav class="flex flex-wrap items-center children:(px-4 py-2 h-full)">
    <RouterLink to="/" class="link flex justify-center">
      <div class="i-ion-home-outline mt-2px" />
    </RouterLink>
    <RouterLink to="/posts" class="link">
      Posts
    </RouterLink>
    <RouterLink to="/team" class="link">
      L'équipe
    </RouterLink>
    <button class="link flex justify-center" @click="toggleDark()">
      <div class="flex relative">
        <i class="i-carbon-sun dark:i-carbon-moon mt-2px" />
        <i class="absolute -right-10px -bottom-6px i-carbon-moon dark:i-carbon-sun text-xs" />
      </div>
    </button>
  </nav>
</template>
