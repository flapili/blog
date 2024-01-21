<script setup>
const props = defineProps({ to: { type: String, required: true } })

const isExternalLink = $computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <RouterLink v-else v-bind="$props">
    <slot />
  </RouterLink>
</template>
