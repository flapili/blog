<template>
  <div class="min-h-screen w-screen flex bg-secondary text-primary">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
::view-transition-new(root),
::view-transition-old(root) {
  animation-duration: 0.4s;
}
</style>
