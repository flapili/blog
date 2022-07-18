<script setup>
const router = useRouter()
const modules = import.meta.glob('@/content/posts/*.md', { eager: true })
const posts = Object.entries(modules).reduce((acc, [key, value]) => {
  const match = key.match(/^\/content\/posts\/(?<path>.+).md$/)
  const path = match.groups.path
  acc.push({ ...value, path })
  return acc
}, [])
  .filter(article => article.archived === false)
  .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

const title = `Posts - ${import.meta.env.VITE_NAME}`
useHead({
  title,
  meta: [
    // open graph meta
    { key: 'og:title', name: 'og:title', content: title },

    // twitter meta
    { key: 'twitter:title', name: 'twitter:title', content: title },
  ],
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
          <RouterLink :to="`/posts/${post.path}`" class="link flex flex-col w-full py-2 px-3">
            <div class="text-xl">
              {{ post.title }}
            </div>
            <div class="flex flex-wrap flex-gap-2">
              <img :src="`/team/${post.author.avatar}`" alt="auteur" class="h-8 w-8 rounded-sm">
              <div v-for="tag in post.tags" :key="tag" class="invert bg-opacity-50 rounded-sm px-1 h-max">
                {{ tag }}
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
