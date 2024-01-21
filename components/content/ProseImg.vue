<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  lazy?: boolean
}>(), {
  lazy: true,
})

const legend = useAttrs().legend as string | undefined

const isOpen = ref(false)

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}
</script>

<template>
  <div class="mx-2 max-h-80vh flex">
    <NuxtImg :src="props.src" :alt="props.alt" format="jpeg" :loading="lazy ? 'lazy' : 'eager'" class="mx-auto rounded-sm cursor-pointer object-scale-down" @click="open" />
  </div>
  <Teleport v-if="isOpen" to="body">
    <div class="z-5000 w-screen h-screen inset-0 fixed bg-gray-900 opacity-90" />
    <div class="z-5001 w-screen h-screen inset-0 fixed">
      <div class="w-full h-full flex justify-center items-center" @click.self="close">
        <Transition
          appear
          enter-active-class="duration-400 ease-out transform"
          enter-from-class="scale-0 opacity-0"
          enter-to-class="opacity-100"
        >
          <NuxtImg :src="props.src" :alt="props.alt" format="jpeg" class="w-[calc(100%-4rem)] h-[calc(100%-4rem)] sm:(w-[calc(100%-8rem)] h-[calc(100%-8rem)]) md:(w-[calc(100%-16rem)] h-[calc(100%-16rem)]) object-contain bg-black rounded-sm" />
        </Transition>
      </div>
    </div>
  </Teleport>
</template>
