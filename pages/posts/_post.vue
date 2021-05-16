<template>
  <div>
    <el-row>
      <el-col :md="{ span: 16, offset: 4 }">
        <el-card class="graycard">
          <article>
            <XyzTransitionGroup
              appear
              class="square-group"
              xyz="fade flip-up flip-left duration-30"
            >
              <el-tag
                v-for="(tag, i) in Array.from(new Set(article.tags.split(';')))"
                :key="i"
                type="info"
                class="tag"
              >
                {{ tag }}
              </el-tag>
            </XyzTransitionGroup>

            <!-- title -->
            <template v-if="article.title">
              <h1 class="title text-center">
                <span
                  v-for="(word, i) in computedTitle"
                  class="word"
                  :key="`title-${i}`"
                >
                  <template v-if="i != 0">&nbsp;</template
                  ><span
                    v-for="(letter, i2) in word"
                    :key="`title-${i}-${i2}`"
                    class="letter xyz-in"
                    xyz="fade small up-5 stagger duration-20"
                    :style="{ '--xyz-index': letter.index }"
                    style="--xyz-stagger: 0.1s"
                    >{{ letter.char }}</span
                  >
                </span>
              </h1>
            </template>

            <!-- author -->
            <div v-if="article.author">
              <el-image
                :src="`/author/${article.author.avatar}`"
                alt="auteur"
                fit="cover"
                class="author-logo"
              ></el-image>
              <div class="author" v-if="article.author">
                <i v-if="article.author.name" class="author-name">
                  {{ article.author.name }}
                </i>
              </div>

            <!-- date -->
            <i class="date"
              >le {{ new Date(article.createdAt).toLocaleDateString() }}</i
            >
            </div>

            <!-- article img -->
            <template v-if="article.image">
              <el-row style="clear: left">
                <el-col :md="{ span: 16, offset: 4 }">
                  <el-image
                    :src="`/posts/${article.image.src}`"
                    :alt="article.image.alt"
                  />
                </el-col>
              </el-row>
            </template>

            <!-- article toc -->
            <template v-if="article.toc.length">
              <nav style="margin-bottom: 50px; margin-top: 30px">
                Sommaire
                <ul style="padding-inline-start: 40px">
                  <li
                    v-for="link in article.toc"
                    :key="link.id"
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
        </el-card>
      </el-col>
    </el-row>

    <!-- article précédent -->
    <el-row type="flex" justify="space-around" style="margin-top: 16px">
      <el-col :lg="{ span: 5 }">
        <nuxt-link
          :to="`${prev.path}`"
          class="no-text-decoration nav-button"
          v-if="prev"
        >
          <el-card
            shadow="hover"
            class="flex"
            style="height: 100%; align-items: center"
            :body-style="{ margin: 'auto' }"
          >
            <i>
              <strong>{{ prev.title }}</strong>
            </i>
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
          <el-card
            shadow="hover"
            class="flex"
            style="height: 100%; align-items: center"
            :body-style="{ margin: 'auto' }"
          >
            <i>
              <strong>{{ next.title }}</strong>
            </i>
          </el-card>
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
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

      return { article, prev, next };
    } catch (e) {
      error({ statusCode: 404, message: "Article non trouvé" });
    }
  },

  async mounted() {
    await this.$nextTick()
    createTermynals();
    loadVisibleTermynals();
  },

  computed: {
    computedTitle() {
      const words = this.article.title.split(" ");
      let index = 0;
      const title = words.map((word) => {
        const letters = word.split("");
        return letters.map((char) => {
          return {
            char,
            index: index++,
          };
        });
      });
      return title;
    },
  },

  head() {
    let image_content = "https://flapili.fr/logo.webp";
    if (this.article.image) {
      image_content = `https://flapili.fr/posts/${this.article.image.src}`;
    }
    const meta = [
      {
        hid: "description",
        property: "description",
        content: this.article.description || "Blog de flapili",
      },
      {
        hid: "image",
        property: "image",
        content: image_content,
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
        property: "og:image",
        content: image_content,
      },
      {
        hid: "og:type",
        property: "og:type",
        content: "website",
      },
      {
        hid: "og:url",
        property: "og:url",
        content: `flapili.fr${this.$route.path}`,
      },
      // Twitter Card
      {
        hid: "twitter:title",
        property: "twitter:title",
        content: this.article.title || "flapili.fr",
      },
      {
        hid: "twitter:description",
        property: "twitter:description",
        content: this.article.description || "Blog de flapili",
      },
      {
        hid: "twitter:image",
        property: "twitter:image",
        content: image_content,
      },
      {
        hid: "twitter:card",
        property: "twitter:card",
        content: "summary_large_image",
      },
    ];
    if (this.article.author && this.article.author.name) {
      meta.push({
        hid: "author",
        property: "author",
        content: this.article.author.name,
      });
      meta.push({
        hid: "publisher",
        property: "publisher",
        content: this.article.author.name,
      });
      meta.push({
        hid: "twitter:creator",
        property: "twitter:creator",
        content: this.article.author.name,
      });
    }
    return {
      title: this.article.title || "flapili.fr",
      meta: meta,
    };
  },
};
</script>

<style scoped>
.tag {
  margin-right: 4px;
  margin-bottom: 4px;
}

.title {
  font-size: 2.5em;
  margin-block-end: 0;
}

.author-name, .date {
  padding-left: 10px;
  padding-bottom: 0px;
  margin: 0px;
}


.author-logo {
  float: left;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 1px solid black;
}

.toc {
  color: royalblue;
}

.toc:hover {
  mix-blend-mode: difference;
  font-weight: bold;
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

.letter {
  display: inline-block;
}
.word {
  display: inline-block;
}
</style>