<script setup lang="ts">
const activeActicle = useActiveArticle()
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <h1 class="w-full flex justify-center text-3xl font-bold">
      <i class="i-dashicons-welcome-write-blog mr-2" />
      Les articles
    </h1>
    <ContentList
      path="/posts" :query="{
        where: [{ archived: { eq: false } }],
      }"
    >
      <template #default="{ list }">
        <div class="mt-8 w-full">
          <ul class="mx-auto w-full flex flex-col flex-gap-y-4 lg:w-1/2">
            <li v-for="post in list" :key="post._id" class="w-full flex rounded-sm" :class="{ active: activeActicle === post._id }">
              <NuxtLink :to="post._path" class="group w-full flex flex-col flex-gap-y-1 rounded-md px-3 px-4 py-2 py-2 ring-green-600 ring-inset transition-all transition-duration-500ms hover:(bg-green-950 ring)" @click="activeActicle = post._id">
                <span class="title w-fit text-xl">
                  {{ post.title }}
                </span>
                <div class="ml-2 text-sm">
                  {{ post.description }}
                </div>
                <div class="flex flex-wrap flex-gap-2">
                  <img :src="`/team/${post.author.avatar}`" alt="auteur" class="h-8 w-8 rounded-sm">
                  <div class="tags mr-auto flex">
                    <div v-for="tag in post.tags" :key="tag" class="border border-green-700 rounded-md bg-green-950 px-1 py-0.5 text-primary transition-all transition-duration-500ms group-hover:(border-black bg-green-500 text-secondary)">
                      {{ tag }}
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </template>
      <template #not-found>
        <div class="grid h-full w-full place-items-center text-4xl">
          c'est bien vide par ici 👀
        </div>
      </template>
    </ContentList>
  </div>
</template>

<style scoped>
.active .title {
  view-transition-name: article-title;
}

.active img {
  view-transition-name: author-avatar;
}

.active .tags {
  color: red !important;
  view-transition-name: article-tags;
}
</style>
