<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'info' | 'warning' | 'danger'
}>(), {
  type: 'info',
})
</script>

<template>
  <div class="m-2 rounded overflow-hidden">
    <div
      class="flex flex-col border rounded text-gray-900 border-l-8 border-0"
      :class="{
        'border-sky-500': props.type === 'info',
        'border-yellow-500': props.type === 'warning',
        'border-red-500': props.type === 'danger',
      }"
    >
      <div
        class="flex p-2"
        :class="{
          'bg-sky-200': props.type === 'info',
          'bg-yellow-200': props.type === 'warning',
          'bg-red-200': props.type === 'danger',
        }"
      >
        <i
          class="text-xl mx-2"
          :class="{
            'i-material-symbols-info text-sky-500': props.type === 'info',
            'i-material-symbols-warning': props.type === 'warning',
            'i-material-symbols-dangerous': props.type === 'danger',
          }"
        />
        <slot name="header">
          <template v-if="props.type === 'info'">
            Information
          </template>
          <template v-else-if="props.type === 'warning'">
            Attention
          </template>
          <template v-else-if="props.type === 'danger'">
            Danger
          </template>
        </slot>
      </div>
      <div
        class="p-2 pl-4"
        :class="{
          'bg-sky-100': props.type === 'info',
          'bg-yellow-100': props.type === 'warning',
          'bg-red-100': props.type === 'danger',
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
