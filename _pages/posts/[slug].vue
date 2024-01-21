<script setup lang="ts">
const { page } = useContent()

// const { params } = useRoute()

// const path = `/posts/${params.slug}`
// const { data: post } = await useAsyncData(path, () => queryContent(path).findOne())
// if (!post.value) {
//   throw createError({
//     message: 'post not found',
//     statusCode: 404,
//     fatal: true,
//   })
// }

// if (post.value.archived) {
//   throw createError({
//     message: 'post archived',
//     statusCode: 410,
//     fatal: true,
//   })
// }

// const title = `${post.value.title} - flapili.fr`
// useSeoMeta({
//   title,
//   ogTitle: title,
//   description: post.value.description,
//   ogDescription: post.value.description,
//   ogImage: () => post.value?.image ? `https://flapili.fr${post.value.image}` : undefined,
//   articleAuthor: [post.value.author.name],
//   articleExpirationTime: () => new Date(post.value!.createdAt).toISOString(),
//   articleTag: post.value?.tags ?? [],
// })
</script>

<template>
  <MainLayout>
    toto
    <!-- <div v-if="post" class="flex flex-col w-full px-4 lg:w-1/2">
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
      </div>
      <component :is="post.default" class="pt-4 sm:pb-20" />
      <ContentRenderer :value="post" />
    </div> -->
  </MainLayout>
</template>
