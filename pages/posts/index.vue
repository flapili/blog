<template>
  <div>
    <el-row>
      <el-col :md="{ span: 16, offset: 4 }">
        <h1 class="text-center">Tous les posts</h1>
        <el-autocomplete
          placeholder="Cherchez quelque chose"
          v-model="search_query"
          :fetch-suggestions="suggest_topic"
          @keypress.enter.native="search"
          class="block"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
        </el-autocomplete>

        <template v-if="articles.length">
          <ul style="padding-inline-start: 0">
            <li v-for="(article, i) in articles" :key="i" class="article">
              <nuxt-link :to="article.path" class="no-text-decoration">
                <el-card shadow="hover">
                  <h3 v-if="article.title" class="title">
                    {{ article.title }}
                  </h3>
                  <span
                    ><i>{{
                      new Date(article.updatedAt).toLocaleString()
                    }}</i></span
                  >
                  <div class="flex">
                    <el-image
                      v-if="article.image"
                      :src="require(`~/assets/${article.image}`)"
                      fit="scale-down"
                    ></el-image>
                    <p v-if="article.description">{{ article.description }}</p>
                  </div>

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
          <el-card shadow="hover" style="margin-top: 1rem">
            <h1>{{ error.title }}</h1>
            <nuxt-content :document="error" />
          </el-card>
        </template>
      </el-col>
    </el-row>
    <template v-if="articles.length && !searched">
      <el-row type="flex" justify="space-around">
        <el-col :lg="{ span: 5 }">
          <nuxt-link
            :to="`${this.$route.path}?page=${this.page - 1}`"
            class="no-text-decoration nav-button"
          >
            <el-card v-if="this.page > 1" shadow="hover" class="page-down">
              page précédente
            </el-card>
          </nuxt-link>
        </el-col>
        <el-col :lg="{ span: 5 }">
          <nuxt-link
            :to="`${this.$route.path}?page=${this.page + 1}`"
            class="no-text-decoration nav-button"
          >
            <el-card v-if="articles.length > 9" shadow="hover" class="page-up">
              page suivante
            </el-card>
          </nuxt-link>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],

  key: (to) => to.fullPath,

  data() {
    return {
      search_query: "",
      searched: false,
    };
  },

  methods: {
    async search() {
      this.articles = await this.$content("posts")
        .only([
          "title",
          "updatedAt",
          "author",
          "description",
          "path",
          "author_avatar",
          "image",
        ])
        .sortBy("updatedAt", "desc")
        .search(this.search_query)
        .fetch();
      if (!this.articles.length) {
        this.error = await this.$content("404").fetch();
      }
      this.searched = true;
    },

    async suggest_topic(qs, cb) {
      if (!qs) {
        return cb(this.topic.map((x) => ({ value: x })));
      }
      return cb(
        this.topic
          .filter((x) => x.toLowerCase().indexOf(qs.toLowerCase()) === 0)
          .map((x) => ({ value: x }))
      );
    },
  },

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
        "image",
      ])
      .sortBy("updatedAt", "desc")
      .skip((page - 1) * 10)
      .limit(10)
      .fetch();

    if (!articles.length) {
      error = await $content("404").fetch();
    }

    const tags = await $content("posts")
      .where({ tags: { $gt: "" } })
      .fetch();

    const topic = [...new Set(tags.map((x) => x.tags.split(" ")).flat())];
    topic.sort((a, b) => a.localeCompare(b));

    return {
      articles,
      error,
      topic,
    };
  },
};
</script>

<style scoped>
.title {
  margin-block-end: 0;
}
.article {
  display: block;
  margin-bottom: 20px;
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

.page-up,
.page-down {
  text-align: center;
}
</style>