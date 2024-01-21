<template>
  <div class="h-full w-full flex flex-col">
    <h1 class="w-full flex justify-center text-3xl font-bold">
      La team
    </h1>
    <ContentList
      path="/team" :query="{
        where: [{ active: { $eq: true } }],
      }"
    >
      <template #default="{ list }">
        <div class="mt-8 w-full">
          <ul class="mx-auto w-full flex flex-wrap items-center justify-center flex-gap-y-4 lg:w-1/2">
            <li v-for="member in list" :key="member._id" class="flex flex-grow rounded-sm">
              <NuxtLink :to="`/team/${member.name}`" class="mx-auto flex flex-col px-3 py-2 link">
                <img :src="`/team/${member.avatar}`" alt="member" class="h-64 w-64 rounded-sm">
                <div class="flex flex-wrap flex-gap-2">
                  <div v-for="role in member.roles" :key="role" class="h-max rounded-sm invert bg-opacity-50 px-1">
                    {{ role }}
                  </div>
                </div>
                <div class="text-xl">
                  {{ member.name }}
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
