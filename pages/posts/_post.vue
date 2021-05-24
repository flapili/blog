<template>
  <div class="container">
    <article>
      <h1 class="text-center title">{{ article.title }}</h1>
      <div
        v-if="article.image && article.image.src"
        class="flex article-img-container"
      >
        <nuxt-img :src="`/posts/${article.image.src}`" class="article-img" />
      </div>
      <div
        class="flex flex-wrap article-tags-container"
        v-if="article.tags.length"
      >
        <div>Catégories:</div>
        <div
          v-for="(tag, indexTag) in article.tags.split(';')"
          :key="`indexTag-${indexTag}`"
          class="flex article-tag"
        >
          {{ tag }}
        </div>
      </div>

      <div v-if="article.author" class="flex author-container">
        <nuxt-img
          :src="`/author/${article.author.avatar}`"
          alt="auteur"
          class="author-logo"
        />
        <div class="author" v-if="article.author">
          <i v-if="article.author.name" class="author-name">
            {{ article.author.name }}
          </i>
        </div>
      </div>
      <nuxt-content :document="article" />
    </article>

    <div class="flex flex-wrap nav-container">
      <nuxt-link v-if="prev" :to="`${prev.path}`" class="no-text-decoration">
        <el-button class="nav-btn">{{ prev.title }}</el-button>
      </nuxt-link>
      <nuxt-link v-if="next" :to="`${next.path}`" class="no-text-decoration">
        <el-button class="nav-btn">{{ next.title }}</el-button>
      </nuxt-link>
    </div>
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
    await this.$nextTick();
    this.$createTermynals();
    this.$loadVisibleTermynals();
    window.addEventListener("scroll", this.$loadVisibleTermynals);
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
.container {
  margin: 0px 25%;
}

@media only screen and (max-width: 991px) {
  .container {
    margin: 0px 5% !important;
  }
  .article-container,
  .nav-btn {
    width: 100% !important;
  }
}

.title {
  font-size: 3rem;
  margin-bottom: 0px;
}

.article-img-container {
  justify-content: center;
}

.article-img {
  width: 50%;
}

.article-tags-container {
  align-items: center;
}
.article-tag {
  align-items: center;
  height: 30px;
  border-radius: 5px;
  margin-left: 10px;
  padding: 0 10px;
  background-color: #efefef;
}

.author-container {
  margin-top: 15px;
}

.author-logo {
  width: 60px;
  height: 60px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.author-name {
  margin-left: 10px;
}

.nav-container {
  justify-content: space-around;
}

.nav-btn {
  height: 60px;
  background-color: #f29100;
}
</style>