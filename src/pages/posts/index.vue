<script setup>
const router = useRouter()
const modules = import.meta.glob('@/content/posts/*.md', { eager: true })
const articles = Object.entries(modules).reduce((acc, [key, value]) => {
  const match = key.match(/^\/content\/posts\/(?<path>.+).md$/)
  const path = match.groups.path
  acc.push({ ...value, path })
  return acc
}, [])
  .filter(article => article.archived === false)
  .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
</script>

<template>
  <div class="flex flex-col w-full">
    <h1 class="flex w-full text-3xl font-bold justify-center">
      <i class="i-dashicons-welcome-write-blog mr-2" />
      Les posts
    </h1>
    <div class="mt-8 w-full">
      <ul v-if="articles.length" class="flex flex-col flex-gap-y-4 mx-auto w-1/2">
        <li v-for="article, i in articles" :key="i" class="flex w-full rounded-sm">
          <RouterLink :to="`/posts/${article.path}`" class="link flex flex-col w-full py-2 px-3">
            <div class="text-xl">
              {{ article.title }}
            </div>
            <div class="flex flex-wrap flex-gap-2">
              <img :src="`/team/${article.author.avatar}`" alt="auteur" class="h-8 w-8 rounded-sm">
              <div v-for="tag in article.tags" :key="tag" class="invert bg-opacity-50 rounded-sm px-1 h-max">
                {{ tag }}
              </div>
              <!-- </ul> -->
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
