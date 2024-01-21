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
  <div v-if="post" class="w-full flex flex-col px-4 lg:w-1/2">
    <div class="title mt-8 self-center text-xl sm:mt-16 md:text-3xl">
      {{ post.title }}
    </div>
    <div class="flex flex-col pl-2 pt-8 sm:pl-8">
      <div class="flex">
        <NuxtLink :to="`/team/${post.author.name}`">
          <img :src="`/team/${post.author.avatar}`" :alt="post.author.name" class="avatar h-12 w-12 rounded-sm">
        </NuxtLink>
        <div class="pt-1">
          <NuxtLink :to="`/team/${post.author.name}`" class="px-2 py-1 link">
            {{ post.author.name }}
          </NuxtLink>
        </div>
      </div>
      <div class="pt-2">
        Le {{ new Date(post.createdAt).toLocaleDateString() }}
      </div>
      <div class="tags mr-auto flex flex-gap-2 pt-2">
        <div v-for="tag in post.tags" :key="tag" class="border-1 border-green-700 rounded-md bg-green-950 px-1 py-0.5 text-primary">
          {{ tag }}
        </div>
      </div>
    </div>
    <div class="my-4 h-1px w-full bg-primary" />
    <ContentRenderer :value="post" class="pt-4 sm:pb-20" />
  </div>
</template>

<style scoped>
.title {
  view-transition-name: article-title;
}

.avatar {
  view-transition-name: author-avatar;
}

.tags {
  view-transition-name: article-tags;
}
</style>
