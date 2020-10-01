<template>
  <div>
    <h1>Derniers posts</h1>
    <ul style="padding-inline-start: 0;">
      <li v-for="(article, i) in articles" :key="i" class="article">
        <!-- <nuxt-link :to="article.path.split('/').pop()">

        </nuxt-link> -->
        <a :href="`posts/${article.path.split('/').pop()}`" class="article-link">
          <el-card>
            <h3 v-if="article.title">{{article.title}}</h3>
            <span v-if="article.description">{{article.description}}</span>
            
            <div>

            </div>
          </el-card>
        </a>
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

  .article-link {
    text-decoration: none;
  }
</style>
