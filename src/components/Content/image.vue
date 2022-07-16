<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  lazy: {
    type: Boolean,
    default: true,
  },
})

let isOpen = $ref(false)

const open = () => {
  isOpen = true
}

const close = () => {
  isOpen = false
}
</script>

<template>
  <img :src="props.src" :alt="props.alt" :loading="lazy ? 'lazy' : 'eager'" class="mx-auto rounded-sm cursor-pointer" @click="open">
  <Teleport v-if="isOpen" to="body">
    <div class="z-5000 w-screen h-screen inset-0 fixed bg-gray-900 opacity-90" />
    <div class="z-5001 w-screen h-screen inset-0 fixed">
      <div class="w-full h-full flex justify-center items-center" @click.self="close">
        <Transition
          appear
          enter-active-class="duration-300 ease-out transform"
          enter-from-class="scale-0 opacity-0"
          enter-to-class="opacity-100"
        >
          <img :src="props.src" :alt="props.alt" :loading="lazy ? 'lazy' : 'eager'" class="w-[calc(100%-4rem)] h-[calc(100%-4rem)] sm:(w-[calc(100%-8rem)] h-[calc(100%-8rem)]) md:(w-[calc(100%-16rem)] h-[calc(100%-16rem)]) object-contain bg-black rounded-sm">
        </Transition>
      </div>
    </div>
  </Teleport>
</template>
