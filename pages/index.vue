<template>
  <div class="flex flex-col h-full w-full">
    <h1 class="flex w-full text-3xl font-bold justify-center">
      <i class="i-dashicons-welcome-write-blog mr-2" />
      Les posts
    </h1>
    <ContentList
      path="/posts" :query="{
        where: [{ archived: { eq: false } }],
      }"
    >
      <template #default="{ list }">
        <div class="mt-8 w-full">
          <ul class="flex flex-col flex-gap-y-4 mx-auto w-full lg:w-1/2">
            <li v-for="post in list" :key="post._id" class="flex w-full rounded-sm">
              <NuxtLink :to="post._path" class="transition-all transition-duration-500ms group ring-inset ring-green-600 hover:(ring bg-green-950) rounded-md flex flex-col w-full py-2 px-3 flex-gap-y-1 py-2 px-4">
                <div class="text-xl">
                  {{ post.title }}
                </div>
                <div class="text-sm ml-2">
                  {{ post.description }}
                </div>
                <div class="flex flex-wrap flex-gap-2">
                  <img :src="`/team/${post.author.avatar}`" alt="auteur" class="h-8 w-8 rounded-sm">
                  <div v-for="tag in post.tags" :key="tag" class="transition-all transition-duration-500ms border px-1 py-0.5 border-green-700 rounded-md text-primary bg-green-950 group-hover:(bg-green-500 text-secondary border-black)">
                    {{ tag }}
                  </div>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </template>
      <template #not-found>
        <div class="w-full h-full grid place-items-center text-4xl">
          c'est bien vide par ici 👀
        </div>
      </template>
    </ContentList>
  </div>
</template>
