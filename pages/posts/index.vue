<script setup>
const { data: posts } = await useAsyncData('posts', async () => {
  const data = await queryContent('/posts/').find()
  return data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
})
</script>

<template>
  <div class="flex flex-col w-full">
    <h1 class="flex w-full text-3xl font-bold justify-center">
      <i class="i-dashicons-welcome-write-blog mr-2" />
      Les posts
    </h1>
    <div class="mt-8 w-full">
      <ul v-if="posts.length" class="flex flex-col flex-gap-y-4 mx-auto w-full lg:w-1/2">
        <li v-for="post, i in posts" :key="i" class="flex w-full rounded-sm">
          <NuxtLink :to="post._path" class="link flex flex-col w-full py-2 px-3 flex-gap-y-1">
            <div class="text-xl">
              {{ post.title }}
            </div>
            <div class="flex flex-wrap flex-gap-2">
              <img :src="post.author.avatar" alt="auteur" class="h-8 w-8 rounded-sm">
              <div v-for="tag in post.tags" :key="tag" class="invert bg-opacity-50 rounded-sm px-1 h-max">
                {{ tag }}
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
