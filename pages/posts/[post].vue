<script setup lang="ts">
const { params } = useRoute()
const path = computed(() => `/posts/${params.post}`)
const { data: post } = await useAsyncData(path.value, () => queryContent(path.value).where({
  archived: { $ne: true },
}).findOne())

if (!post.value)
  throw createError({ statusCode: 404 })
</script>

<template>
  <div v-if="post" class="flex flex-col w-full px-4 lg:w-1/2">
    <div class="text-xl md:text-3xl self-center pt-8 sm:pt-16">
      {{ post.title }}
    </div>
    <div class="pl-2 sm:pl-8 pt-8">
      <div class="flex">
        <NuxtLink :to="`/team/${post.author.name}`">
          <img :src="`/team/${post.author.avatar}`" :alt="post.author.name" class="h-12 w-12 rounded-sm">
        </NuxtLink>
        <div class="pt-1">
          <NuxtLink :to="`/team/${post.author.name}`" class="link py-1 px-2">
            {{ post.author.name }}
          </NuxtLink>
        </div>
      </div>
      <div class="pt-2">
        Le {{ new Date(post.createdAt).toLocaleDateString() }}
      </div>
      <div class="pt-2 flex flex-gap-2">
        <div v-for="tag in post.tags" :key="tag" class="border-1 px-1 py-0.5 border-green-700 rounded-md text-primary bg-green-950 ">
          {{ tag }}
        </div>
      </div>
    </div>
    <div class="my-4 h-1px w-full bg-primary" />
    <ContentRenderer :value="post" class="pt-4 sm:pb-20" />
  </div>
</template>
