<script setup>
const slots = useSlots()
const hasHeader = computed(() => !!slots.header)
</script>

<template>
  <div class="mx-2 rounded overflow-hidden">
    <div class="flex flex-col border rounded text-gray-900 border-l-8 border-0 border-sky-500">
      <div class="flex bg-sky-200 p-2">
        <i class="i-material-symbols-info text-sky-500 text-xl mx-2" />
        <slot name="header">
          Info
        </slot>
      </div>
      <div class="bg-sky-100 p-2 pl-4">
        <slot />
      </div>
    </div>
  </div>
</template>

