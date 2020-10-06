<template>
  <el-row>
    <el-col :md="{ span: 16, offset: 4 }">
      <el-card>
        <article>
          <!-- title -->
          <template v-if="article.title">
            <h1 class="title text-center">
              {{ article.title }}
            </h1>
          </template>

          <!-- article img -->
          <template v-if="article.image">
            <div class="flex" style="justify-content: center">
              <el-image
                :src="require(`~/assets/${article.image}`)"
                class="logo"
              ></el-image>
            </div>
          </template>

          <template v-if="article.toc.length">
            <span>Sommaire</span>
            <nav style="margin-bottom: 50px">
              <ul style="padding-inline-start: 0">
                <li v-for="link in article.toc" :key="link.id" class="nav-item">
                  <nuxt-link
                    :to="`#${link.id}`"
                    :class="`toc-${link.depth}`"
                    class="no-text-decoration toc"
                  >
                    {{ link.text }}
                  </nuxt-link>
                </li>
              </ul>
            </nav>
          </template>
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
      const article = await $content("posts", params.post).fetch();
      return { article };
    } catch (error) {
      const article = await $content("404").fetch();
      return { article };
    }
  },

  head() {
    return {
      title: this.article.title || "flapili.fr",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.article.description || "Blog de flapili",
        },
        // Open Graph
        {
          hid: "og:title",
          property: "og:title",
          content: this.article.title || "flapili.fr",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.article.description || "Blog de flapili",
        },
        // Twitter Card
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: this.article.title || "flapili.fr",
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: this.article.description || "Blog de flapili",
        },
      ],
    };
  },
};
</script>

<style scoped>
.title {
  font-size: 2.5em;
  margin-block-end: 0;
}
.nav-item {
  list-style-type: none;
  text-decoration: none !important;
}

.toc {
  color: #11a7e2;
}

.toc-1 {
  margin-left: 0px;
}
.toc-2 {
  margin-left: 10px;
}
.toc-3 {
  margin-left: 20px;
}
</style>