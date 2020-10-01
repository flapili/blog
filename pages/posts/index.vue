<template>
  <div>
    <h1>Derniers posts</h1>
    <ul style="padding-inline-start: 0;">
      <li v-for="(article, i) in articles" :key="i" class="article">
        <nuxt-link :to="`posts/${article.path.split('/').pop()}`" class="no-text-decoration">
          <el-card>
            <h3 v-if="article.title">{{article.title}}</h3>
            <p v-if="article.description">{{article.description}}</p>
            <div>
              <span v-if="article.author_avatar">
                <el-image :src="require(`~/assets/${author_avatar}`)" fit="cover" class="logo"></el-image>
                </span>
              <span v-if="article.author">{{article.author}}</span>
              
            </div>
          </el-card>
        </nuxt-link>
      </li>
    </ul>

  </div>
</template>

<script>
export default {
  computed: {
      articles() {
        return this.$store.state.articles.last_articles
      }
    },
  }
</script>

<style scoped>
  .article {
    display: block;
    margin-bottom: 10px;
  }
</style>
