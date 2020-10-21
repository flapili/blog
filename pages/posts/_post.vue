<template>
  <div>
    <el-row>
      <el-col :md="{ span: 16, offset: 4 }">
        <el-card>
          <article v-if="error == false">
            <!-- title -->
            <template v-if="article.title">
              <h1 class="title text-center">
                {{ article.title }}
              </h1>
            </template>

            <!-- author -->
            <div v-if="article.author" class="flex" style="align-items: flex">
              <el-image
                :src="`/author/${article.author.avatar}`"
                alt="auteur"
                fit="cover"
                class="logo"
              ></el-image>
              <div class="author" v-if="article.author">
                <i v-if="article.author.name" class="author-name">
                  {{ article.author.name }}
                </i>
              </div>

              <!-- date -->
              <br />
            </div>
            <i class="date">{{
              new Date(article.createdAt).toLocaleString()
            }}</i>

            <!-- article img -->
            <template v-if="article.image">
              <div class="flex" style="justify-content: center">
                <el-image
                  :src="`/posts/${article.image.src}`"
                  :alt="article.image.alt"
                ></el-image>
              </div>
            </template>

            <!-- article toc -->
            <template v-if="article.toc.length">
              <nav style="margin-bottom: 50px; margin-top: 30px">
                Sommaire
                <ul style="padding-inline-start: 40px">
                  <li v-for="link in article.toc" :key="link.id"
                  :class="`toc-${link.depth}`"
                  >
                    <nuxt-link
                      :to="`#${link.id}`"
                      class="no-text-decoration toc"
                    >
                      {{ link.text }}
                    </nuxt-link>
                  </li>
                </ul>
              </nav>
            </template>

            <!-- content -->
            <nuxt-content :document="article" />
          </article>
          <!-- error -->
          <nuxt-content v-else :document="article" />
        </el-card>
      </el-col>
    </el-row>

    <!-- article précédant -->
    <el-row type="flex" justify="space-around" style="margin-top: 16px">
      <el-col :lg="{ span: 5 }">
        <nuxt-link
          :to="`${prev.path}`"
          class="no-text-decoration nav-button"
          v-if="prev"
        >
          <el-card shadow="hover" class="page-down">
            <i
              ><strong>{{ prev.title }}</strong></i
            >
          </el-card>
        </nuxt-link>
      </el-col>

      <!-- article suivant -->
      <el-col :lg="{ span: 5 }">
        <nuxt-link
          :to="`${next.path}`"
          class="no-text-decoration nav-button"
          v-if="next"
        >
          <el-card shadow="hover" class="page-down">
            <i
              ><strong>{{ next.title }}</strong></i
            >
          </el-card>
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    try {
      const article = await $content("posts", params.post)
        .where({ archived: false })
        .fetch();

      const [prev, next] = await $content("posts")
        .only(["title", "path"])
        .sortBy("createdAt")
        .where({ archived: false })
        .surround(params.post)
        .fetch();

      return { article, prev, next, error: false };
    } catch (error) {
      const article = await $content("404").fetch();
      return { article, prev: null, next: null, error: true };
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
        {
          hid: "image",
          name: "image",
          content: `https://flapili.fr/${this.article.image || "logo.webp"}`,
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
        {
          hid: "og:image",
          name: "og:image",
          content: `https://flapili.fr/${this.article.image || "logo.webp"}`,
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
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: `https://flapili.fr/${this.article.image || "logo.webp"}`,
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

.author {
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}

.author-name {
  padding-left: 10px;
  padding-bottom: 0px;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

.date {
  margin-left: auto;
  margin-right: 50px;
}

.toc {
  color: #11a7e2;
}

.toc-2 {
  margin-left: 0px;
}

.toc-3 {
  margin-left: 15px;
}

.nav-button {
  color: inherit;
}

.page-up,
.page-down {
  text-align: center;
}
</style>