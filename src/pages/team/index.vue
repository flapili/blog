<script setup>
const router = useRouter()
const modules = import.meta.glob('@/content/team/*.md', { eager: true })
const members = Object.entries(modules).reduce((acc, [key, value]) => {
  const match = key.match(/^\/content\/team\/(?<path>.+).md$/)
  const path = match.groups.path
  acc.push({ ...value, path })
  return acc
}, [])
  .filter(member => member.active !== false)
  .sort((a, b) => a.name.localeCompare(b.name))

const title = `La team - ${import.meta.env.VITE_NAME}`
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
      La team
    </h1>
    <div class="mt-8 w-full">
      <ul v-if="members.length" class="flex flex-col flex-gap-y-4 mx-auto w-1/2">
        <li v-for="member, i in members" :key="i" class="flex w-full rounded-sm">
          <RouterLink :to="`/team/${member.name}`" class="link flex flex-col w-full py-2 px-3">
            <div class="text-xl">
              {{ member.name }}
            </div>
            <div class="flex flex-wrap flex-gap-2">
              <img :src="`/team/${member.avatar}`" alt="member" class="h-8 w-8 rounded-sm">
              <div v-for="role in member.roles" :key="role" class="invert bg-opacity-50 rounded-sm px-1 h-max">
                {{ role }}
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
