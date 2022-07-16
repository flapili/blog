<script setup>
const year = useDateFormat(useNow(), 'YYYY')
</script>

<template>
  <footer class="border-t-1px flex flex-col justify-center items-center py-4 flex-gap-2)">
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
</template>
