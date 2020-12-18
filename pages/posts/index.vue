<template>
  <div>
    <el-row>
      <el-col :md="{ span: 4, offset: 16 }">
        <el-autocomplete
          placeholder="Cherchez quelque chose"
          v-model="search_query"
          :fetch-suggestions="fetch_tags"
          @keypress.enter.native="search"
          class="block"
          style="margin-bottom: 16px"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
        </el-autocomplete>
      </el-col>
    </el-row>
    <el-row>
      <el-col :md="{ span: 16, offset: 4 }">
        <el-card
          class="no-border"
          style="background-color: rgba(255, 255, 255, 0.2)"
        >
          <h1 class="text-center title-page">
            <XyzTransitionGroup xyz="fade small stagger-1 duration-15" appear class="splitting">
              <span v-for="(c, i) in 'Les posts'" :key="i">
                <template v-if="c == ' '">&nbsp;</template>
                <template v-else>{{ c }}</template>
              </span>
            </XyzTransitionGroup>
          </h1>
        </el-card>

        <template v-if="articles.length">
          <ul style="padding-inline-start: 0">
            <XyzTransitionGroup
              appear
              class="square-grid"
              xyz="fade small duration-30 stagger-2"
            >
              <li v-for="(article, i) in articles" :key="i" class="article">
                <nuxt-link :to="article.path" class="no-text-decoration">
                  <el-card shadow="hover" class="no-border transparent-card">
                    <!-- tags -->
                    <div>
                      <el-tag
                        v-for="(tag, i) in Array.from(
                          new Set(article.tags.split(';'))
                        )"
                        :key="i"
                        type="info"
                        class="tag"
                      >
                        {{ tag }}
                      </el-tag>
                    </div>

                    <!-- title -->
                    <h3 v-if="article.title" class="title">
                      {{ article.title }}
                    </h3>

                    <!-- date -->
                    <span>
                      <i>{{ new Date(article.createdAt).toLocaleString() }}</i>
                    </span>

                    <!-- image -->
                    <div class="flex">
                      <el-image
                        v-if="article.image"
                        :src="`/posts/${article.image.src}`"
                        :alt="article.image.alt"
                        fit="scale-down"
                        style="max-width: 25%"
                      ></el-image>

                      <!-- description -->
                      <p v-if="article.description" style="margin-left: 10px">
                        {{ article.description }}
                      </p>
                    </div>

                    <!-- author -->
                    <div class="author" v-if="article.author">
                      <i v-if="article.author.name" class="author-name">
                        {{ article.author.name }}
                      </i>
                      <span v-if="article.author.avatar">
                        <el-image
                          :src="`/author/${article.author.avatar}`"
                          fit="cover"
                          class="logo"
                          alt="auteur"
                        ></el-image>
                      </span>
                    </div>
                  </el-card>
                </nuxt-link>
              </li>
            </XyzTransitionGroup>
          </ul>
        </template>

        <!-- error 404 -->
        <template v-else>
          <el-card shadow="hover" style="margin-top: 1rem">
            <nuxt-content :document="error" />
          </el-card>
        </template>
      </el-col>
    </el-row>

    <template v-if="articles.length && !searched">
      <el-row type="flex" justify="space-around">
        <el-col :lg="{ span: 5 }">
          <nuxt-link
            :to="`${$route.path}?page=${page - 1}`"
            class="no-text-decoration nav-button"
          >
            <el-card v-if="page > 1" shadow="hover" class="page-down">
              page précédente
            </el-card>
          </nuxt-link>
        </el-col>
        <el-col :lg="{ span: 5 }">
          <nuxt-link
            :to="`${$route.path}?page=${page + 1}`"
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
  head() {
    return {
      title: "Les posts - flapili.fr",
    };
  },

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
          "createdAt",
          "author",
          "description",
          "path",
          "author_avatar",
          "image",
          "tags",
        ])
        .sortBy("createdAt", "desc")
        .search(this.search_query)
        .where({ archived: false })
        .fetch();
      if (!this.articles.length) {
        this.error = await this.$content("404").fetch();
      }
      this.searched = true;
    },

    async fetch_tags(qs, cb) {
      if (!qs) {
        return cb(this.tags.map((x) => ({ value: x })));
      }
      return cb(
        this.tags
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
        "createdAt",
        "author",
        "description",
        "path",
        "image",
        "tags",
      ])
      .sortBy("createdAt", "desc")
      .where({ archived: false })
      .skip((page - 1) * 10)
      .limit(10)
      .fetch();

    if (!articles.length) {
      error = await $content("404").fetch();
    }

    const article_with_tags = await $content("posts")
      .where({ archived: false, tags: { $gt: "" } })

      .fetch();

    const tags = [
      ...new Set(
        article_with_tags.map((article) => article.tags.split(";")).flat()
      ),
    ];
    tags.sort((a, b) => a.localeCompare(b));

    return {
      articles,
      error,
      tags,
    };
  },
};
</script>

<style scoped>
.tag {
  margin-right: 4px;
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

.square {
  background-color: red;
  width: 100px;
  height: 100px;
}
</style>