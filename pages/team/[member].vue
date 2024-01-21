<script setup lang="ts">
const { params } = useRoute()

const path = `/team/${params.member}`
const { data: member } = await useAsyncData(path, () => queryContent(path).where({
  active: { $eq: true },
}).findOne())
if (!member.value) {
  throw createError({
    message: 'member not found',
    statusCode: 404,
    fatal: true,
  })
}
</script>

<template>
  <div v-if="member" class="w-full flex flex-col px-4 lg:w-1/2">
    <div class="self-center pt-8 text-xl sm:pt-16 md:text-3xl">
      {{ member.name }}
    </div>
    <div class="pl-2 pt-8 sm:pl-8">
      <div class="flex flex-wrap flex-gap-2">
        <img :src="`/team/${member.avatar}`" :alt="member.name" class="h-12 w-12 rounded-sm">
        <div v-for="role in member.roles" :key="role" class="h-max rounded-sm invert bg-opacity-50 px-1">
          {{ role }}
        </div>
      </div>
    </div>
    <ContentRenderer :value="member" class="pt-4 sm:pb-20" />
  </div>
</template>
