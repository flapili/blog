<script setup lang="ts">
const { params } = useRoute()

const path = `/team/${params.memberId}`
const { data: member } = await useAsyncData(path, () => queryContent(path).findOne())
if (!member.value) {
  throw createError({
    message: 'member not found',
    statusCode: 404,
    fatal: true,
  })
}

if (member.value.active !== true) {
  throw createError({
    message: 'member not active',
    statusCode: 410,
    fatal: true,
  })
}
</script>

<template>
  <div v-if="member" class="flex flex-col w-full px-4 lg:w-1/2">
    <div class="text-xl md:text-3xl self-center pt-8 sm:pt-16">
      {{ member.name }}
    </div>
    <div class="pl-2 sm:pl-8 pt-8">
      <div class="flex flex-wrap flex-gap-2">
        <img :src="`/team/${member.avatar}`" :alt="member.name" class="h-12 w-12 rounded-sm">
        <div v-for="role in member.roles" :key="role" class="invert bg-opacity-50 rounded-sm px-1 h-max">
          {{ role }}
        </div>
      </div>
    </div>
    <ContentRenderer :value="member" class="pt-4 sm:pb-20" />
  </div>
</template>
