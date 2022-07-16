<template>
  <div class="min-h-screen min-w-screen flex flex-col">
    <div class="flex w-full my-8 items-center">
      <div class="hidden sm:block text-3xl pl-8" to="/">
        flapili.fr
      </div>
      <Navbar class="ml-auto mr-auto sm:(mr-8 text-xl)" />
    </div>
    <main class="h-full w-full flex justify-center">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
