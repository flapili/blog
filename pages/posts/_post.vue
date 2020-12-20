<template>
  <div>
    <el-row>
      <el-col :md="{ span: 16, offset: 4 }">
        <el-card class="transparent-card">
          <article v-if="error == false">
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
                <XyzTransitionGroup
                  xyz="fade small duration-5 up"
                  appear
                  class="splitting"
                  style="--xyz-stagger: 0.05s"
                >
                  <span v-for="(c, i) in article.title" :key="i">
                    <template v-if="c == ' '">&nbsp;</template>
                    <template v-else>{{ c }}</template>
                  </span>
                </XyzTransitionGroup>
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
                  style="max-width: 50%;"
                ></el-image>
              </div>
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
          <!-- error -->
          <nuxt-content v-else :document="article" />
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

.toc:hover {
  mix-blend-mode: difference
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
  height: 100%;
}
</style>