<script setup>
const props = defineProps({ memberUrl: { type: String, required: true } })

const member = await import(`../../../content/team/${props.memberUrl}.md`)
if (member.active === false) {
  await useRouter().replace('/404')
}
else {
  const title = `${member.name} - ${import.meta.env.VITE_NAME}`
  const description = `Ici on parle de ${member.name}`
  useHead({
    title,
    meta: [
      { key: 'description', name: 'description', content: description },

      // open graph meta
      { key: 'og:description', name: 'og:description', content: description },
      { key: 'og:title', name: 'og:title', content: title },

      // twitter meta
      { key: 'twitter:description', name: 'twitter:description', content: description },
      { key: 'twitter:title', name: 'twitter:title', content: title },
    ],
  })
}
</script>

<template>
  <div v-if="member.active !== false" class="flex flex-col w-full px-4 lg:w-1/2">
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
    <component :is="member.default" class="pt-4 sm:pb-20" />
  </div>
</template>
