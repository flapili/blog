<script setup lang="ts">
// import { MonacoEditor } from '#components'
import { codeToHtml } from 'shikiji'
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveLineBreak,
} from 'shikiji-transformers'

const props = withDefaults(
  defineProps<{
    code?: string
    language?: string
    filename?: string | null
    highlights?: number[]
  }>(),
  { language: '', code: '', filename: null, highlights: () => [] },
)

const code = await codeToHtml(props.code.trim(), {
  lang: props.language,
  theme: 'nord',
  transformers: [
    transformerRemoveLineBreak(),
    transformerNotationDiff(),
    transformerNotationHighlight(),
    transformerNotationWordHighlight(),
    transformerNotationFocus(),
    transformerNotationErrorLevel(),
  ],
})
</script>

<template>
  <div class="flex flex-col w-full my-4 border-2 border-primary bg-[#2e3440ff]">
    <div class="flex bg-primary h-8 items-center">
      <div v-if="language" class="ml-2 bg-secondary rounded p-1 text-xs">
        {{ language }}
      </div>
      <div v-if="filename" class="ml-2 text-secondary">
        {{ filename }}
      </div>
    </div>
    <div class="flex max-h-80vh flex w-full h-full scrollable scrollbar-track-color-[#2e3440ff]">
      <div class="flex-grow pl-2 pr-16 py-2" v-html="code" />
    </div>
  </div>
</template>
