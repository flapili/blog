<template>
  <div>
    <el-row>
      <el-col :lg="{ span: 16, offset: 4 }">
        <h1 class="text-center">Tous les posts</h1>
        <template v-if="articles.length">
          <ul style="padding-inline-start: 0">
            <li v-for="(article, i) in articles" :key="i" class="article">
              <nuxt-link :to="article.path" class="no-text-decoration">
                <el-card shadow="hover">
                  <h3 v-if="article.title">{{ article.title }}</h3>
                  <p v-if="article.description">{{ article.description }}</p>

                  <div class="author">
                    <template v-if="article.author"
                      ><i class="author-name">{{ article.author }}</i></template
                    >
                    <span v-if="article.author_avatar">
                      <el-image
                        :src="require(`~/assets/${article.author_avatar}`)"
                        fit="cover"
                        class="logo"
                      ></el-image>
                    </span>
                  </div>
                </el-card>
              </nuxt-link>
            </li>
          </ul>
        </template>
        <template v-else>
          <el-card shadow="hover">
            <nuxt-content :document="error" />
          </el-card>
        </template>
      </el-col>
    </el-row>
    <template v-if="articles.length">
      <el-row type="flex" justify="space-around">
        <el-col :lg="{ span: 5 }">
          <el-card v-if="this.page > 1" shadow="hover">
            <nuxt-link
              :to="`${this.$route.path}?page=${this.page - 1}`"
              class="no-text-decoration nav-button"
            >
              page précédente
            </nuxt-link>
          </el-card>
        </el-col>
        <el-col :lg="{ span: 5 }">
          <el-card
            v-if="articles.length > 9"
            shadow="hover"
            style="text-align: right"
          >
            <nuxt-link
              :to="`${this.$route.path}?page=${this.page + 1}`"
              class="no-text-decoration nav-button"
            >
              page suivante
            </nuxt-link>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],

  computed: {
    page() {
      if (
        this.$route.query.page == parseInt(this.$route.query.page) &&
        parseInt(this.$route.query.page) > 0
      ) {
        return parseInt(this.$route.query.page);
      } else {
        return 1;
      }
    },
  },

  async asyncData({ $content, query }) {
    let page = query.page;
    let error = false;

    if (page == parseInt(page) && parseInt(page) > 0) {
      page = parseInt(page);
    } else {
      page = 1;
    }

    const articles = await $content("posts")
      .only([
        "title",
        "updatedAt",
        "author",
        "description",
        "path",
        "author_avatar",
      ])
      .sortBy("updatedAt", "desc")
      .skip((page - 1) * 10)
      .limit(10)
      .fetch();

    if (!articles.length) {
      error = await $content("404").fetch();
    }

    return {
      articles,
      error,
    };
  },
};
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

.nav-button {
  color: inherit;
}

</style>
