<template>
  <div>
    <h1>Derniers posts</h1>
    <ul style="padding-inline-start: 0;">
      <li v-for="(article, i) in articles" :key="i" class="article">
        
        <nuxt-link :to="article.path" class="no-text-decoration">
          <el-card shadow="hover">
            <h3 v-if="article.title">{{ article.title }}</h3>
            <p v-if="article.description">{{ article.description }}</p>

            <div class="author">
              <template v-if="article.author"><i class="author-name">{{ article.author }}</i></template>
              <span v-if="article.author_avatar">
                <el-image :src="require(`~/assets/${article.author_avatar}`)" fit="cover" class="logo"></el-image>
              </span>
            </div>

          </el-card>
        </nuxt-link>
      </li>
    </ul>

  </div>
</template>

<script>
export default {
    async asyncData({ $content }) {

      const articles = await $content("posts")
        .only(["title", "updatedAt", "author", "description", "path", "author_avatar"])
        .sortBy("updatedAt", "desc")
        .limit(10)
        .fetch()

        return {
          articles,
      }
    },
  }
</script>

<style scoped>
  .article {
    display: block;
    margin-bottom: 10px;
  }

  .author {
    float: right;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
  }

  .author-name {
    padding-right: 10px;
  }

  .logo {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
</style>
