<script setup lang="ts">
import type { Toc } from '@nuxt/content/dist/runtime/types'

const props = defineProps<{
  toc: Toc
}>()

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  links: Toc['links']
}>()
</script>

<template>
  <DefineTemplate v-slot="{ links }">
    <ul v-if="links">
      <li v-for="link in toc.links" :key="link.id">
        <a :href="`#${link.id}`" class="link">
          {{ link.text }}
        </a>
      </li>
    </ul>
  </DefineTemplate>

  <ReuseTemplate :links="props.toc.links" />
</template>
