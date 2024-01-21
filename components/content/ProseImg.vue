<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

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
  <figure class="m-2 flex flex-col">
    <img :src="props.src" :alt="props.alt" :loading="lazy ? 'lazy' : 'eager'" class="mx-auto h-full max-h-80vh cursor-pointer rounded-sm object-scale-down" @click="open">
    <figcaption v-if="legend" class="mx-auto mt-1 italic">
      {{ legend }}
    </figcaption>
  </figure>
  <Teleport v-if="isOpen" to="body">
    <div class="fixed inset-0 z-5000 h-screen w-screen bg-gray-900 opacity-90" />
    <div class="fixed inset-0 z-5001 h-screen w-screen">
      <div class="h-full w-full flex items-center justify-center" @click.self="close">
        <Transition
          appear
          enter-active-class="duration-400 ease-out transform"
          enter-from-class="scale-0 opacity-0"
          enter-to-class="opacity-100"
        >
          <img :src="props.src" :alt="props.alt" class="h-[calc(100%-4rem)] w-[calc(100%-4rem)] rounded-sm bg-black object-contain md:(h-[calc(100%-16rem)] w-[calc(100%-16rem)]) sm:(h-[calc(100%-8rem)] w-[calc(100%-8rem)])">
        </Transition>
      </div>
    </div>
  </Teleport>
</template>
