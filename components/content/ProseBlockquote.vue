<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    code?: string
    language?: string
    filename?: string | null
    highlights?: number[]
  }>(),
  { language: '', code: '', filename: null, highlights: () => [] },
)
</script>

<template>
  <span class="border-1 text-primary">
    {{ props.code }}
  </span>
</template>
