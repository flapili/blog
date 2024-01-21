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
  <div class="my-4 w-full flex flex-col border-2 border-gray-900 bg-[#2e3440ff]">
    <div class="h-8 flex items-center bg-gray-900">
      <div v-if="language" class="ml-2 border border-green-700 rounded-md bg-green-950 bg-secondary px-1 py-0.5 text-sm text-primary">
        {{ language }}
      </div>
      <div v-if="filename" class="ml-2 text-secondary">
        {{ filename }}
      </div>
    </div>
    <div class="h-full max-h-80vh w-full flex flex scrollbar-track-color-[#2e3440ff] scrollable">
      <div class="flex-grow py-2 pl-0.5 pr-16" v-html="code" />
    </div>
  </div>
</template>
