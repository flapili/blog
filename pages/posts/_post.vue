<template>
  <el-row>
    <el-col :lg="{ span: 16, offset: 4 }">
      <el-card>
        <article>
          <h1 v-if="article.title" class="title text-center">{{article.title}}</h1>

          <nav style="margin-bottom: 50px;">
            <ul>
              <li v-for="link of article.toc" :key="link.id" class="nav-item">
                <NuxtLink :to="`#${link.id}`">{{ link.text }}</NuxtLink>
              </li>
            </ul>
          </nav>
          <nuxt-content :document="article" />
        </article>  
      </el-card>
    </el-col>
  </el-row>

</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      try {
        const article = await $content('posts', params.post).fetch()
        return {article}
      }
      catch (error) {
        const article = await $content("404").fetch()
        return {article}
      }          
    },

    head() {
      
      return {
        title: this.article.title || 'flapili.fr',
        meta: [
          { hid: 'description', name: 'description', content: this.article.description || 'Blog de flapili'},
          // Open Graph
          { hid: 'og:title', property: 'og:title', content: this.article.title || 'flapili.fr'},
          { hid: 'og:description', property: 'og:description', content: this.article.description || 'Blog de flapili'},
          // Twitter Card
          { hid: 'twitter:title', name: 'twitter:title', content: this.article.title || 'flapili.fr'},
          { hid: 'twitter:description', name: 'twitter:description', content: this.article.description || 'Blog de flapili'}
        ]
      }
    },
  }
</script>

<style scoped>
  .title {
    font-size: 2.5em;
    margin-block-end: 0;
  }
  .nav-item {
    list-style-type: decimal;
  }

</style>