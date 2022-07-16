<script setup>
const props = defineProps({ postUrl: { type: String, required: true } })

const post = await import(`../../../content/posts/${props.postUrl}.md`)
if (post.archived === true) {
  await useRouter().replace('/404')
}
else {
  useSchemaOrg([
    defineArticle({
      '@type': 'TechArticle',
      'datePublished': new Date(post.createdAt),
      'headline': post.title,
      'description': post.description,
      'author': [{ name: post.author.name }],
    }),
  ])
}
</script>

<template>
  <div v-if="post.archived !== true" class="flex flex-col w-full px-4 lg:w-1/2">
    <div class="text-xl md:text-3xl self-center pt-8 sm:pt-16">
      {{ post.title }}
    </div>
    <div class="pl-2 sm:pl-8 pt-8">
      <div class="flex">
        <RouterLink :to="`/team/${post.author.name}`">
          <img :src="`/team/${post.author.avatar}`" :alt="post.author.name" class="h-12 w-12 rounded-sm">
        </RouterLink>
        <div class="pt-1">
          <RouterLink :to="`/team/${post.author.name}`" class="link py-1 px-2">
            {{ post.author.name }}
          </RouterLink>
        </div>
      </div>
      <div class="pt-2">
        Le {{ new Date(post.createdAt).toLocaleDateString() }}
      </div>
    </div>
    <component :is="post.default" class="pt-4 sm:pb-20" />
  </div>
</template>
