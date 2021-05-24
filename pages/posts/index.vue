<template>
  <div class="container">
    <template v-if="articles.length">
      <h1>Derniers posts</h1>
      <ul class="flex flex-wrap articles-container">
        <li
          v-for="(article, indexArticle) in articles"
          :key="`indexArticle-${indexArticle}`"
          class="article-container"
        >
          <div class="article">
            <nuxt-link
              :to="article.path"
              class="no-text-decoration"
              style="color: black"
            >
              <div class="flex flex-column">
                <nuxt-img
                  :src="`/posts/${article.image.src}`"
                  class="article-img"
                />
                <div class="article-body">
                  <div class="article-date">
                    <font-awesome-icon :icon="['far', 'clock']" />
                    {{ new Date(article.createdAt).toLocaleDateString() }} -
                    {{ article.author.name }}
                  </div>
                  <div class="article-title">{{ article.title }}</div>
                  <div
                    class="flex flex-wrap article-tags-container"
                    v-if="article.tags.length"
                  >
                    <div>Catégories:</div>
                    <div
                      v-for="(tag, indexTag) in article.tags.split(';')"
                      :key="`indexArticle-${indexArticle}-indexTag-${indexTag}`"
                      class="flex article-tag"
                    >
                      {{ tag }}
                    </div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </li>
      </ul>
    </template>
    <template v-else>
      <h1>Aucun article n'a été trouvé</h1>
    </template>
  </div>
</template>

<script>
export default {
  async asyncData({ $content }) {
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
      .fetch();

    return { articles };
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
  .article-container {
    width: 100% !important;
  }
}

.articles-container {
  padding: 0px;
  list-style: none;
}

.article-container {
  width: 50%;
}

.article-container:first-child {
  width: 100%;
}

.article {
  padding: 20px;
  margin: 20px;
  border-radius: 15px;
  background-color: white;
}

.article-img {
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.article-body, .article-img {
  background: linear-gradient(to right, #b8b8b8 50%, white 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all 0.5s ease-out;
}

.article-body:hover, .article-img:hover {
  background-position: left bottom;
}

.article-title {
  font-size: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.article-date {
  font-weight: bold;
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
</style>