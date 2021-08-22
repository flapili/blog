<template>
  <div>
    <el-dialog :visible.sync="dialogSearchVisible" class="dialogSearch">
      <div>
        <el-input
          v-model="searchQuery"
          placeholder="Rechercher un article"
          @input="search"
          @compositionupdate="search"
        />
        <div v-for="(article, index) in searchResult" :key="index">
          <el-divider />
          <nuxt-link :to="article.path" class="no-text-decoration">
            <div
              class="flex"
              style="flex-direction: column"
              @click="dialogSearchVisible = false"
            >
              <img
                :src="`posts/${article.image.src}`"
                class="search-result-img"
              />
              <div class="search-result-card">
                <div class="search-result-card-date">
                  <font-awesome-icon :icon="['far', 'clock']" />
                  {{ new Date(article.createdAt).toLocaleDateString() }} -
                  {{ article.author.name }}
                </div>
                <div class="search-result-card-title">{{ article.title }}</div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </el-dialog>

    <el-container>
      <el-header class="header">
        <el-menu
          mode="horizontal"
          background-color="transparent"
          text-color="black"
          active-text-color="#ffd04b"
          class="nav-menu"
          :default-active="activeIndex"
          router
        >
          <el-menu-item index="/" class="nav-menu-item">
            <img
              src="/logo.png"
              class="logo"
              alt="logo"
            />
          </el-menu-item>
          <el-menu-item index="/team" class="nav-menu-item">
            L'équipe
          </el-menu-item>
          <el-menu-item index="/posts" class="nav-menu-item">
            Posts
          </el-menu-item>
        </el-menu>
        <button class="search-btn" @click="dialogSearchVisible = true">
          <font-awesome-icon :icon="['fa', 'search']" size="2x" />
        </button>
      </el-header>

      <el-main class="main">
        <nuxt />
      </el-main>

      <el-footer class="text-center" height="40px">
        ©{{ new Date().getFullYear() }} flapili.fr
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  data() {
    return {
      dialogSearchVisible: false,
      searchLoading: false,
      searchQuery: "",
      searchResult: [],
    };
  },

  computed: {
    activeIndex() {
      return this.$store.state["menu-active-item"].activeIndex;
    },
  },

  methods: {
    search: debounce(async function (newValue) {
      this.searchResult = await this.$content("posts")
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
        .search(newValue)
        .where({ archived: false })
        .fetch();
    }, 1000),
  },
};
</script>

<style scoped>
.header {
  padding: 0;
  display: flex;
}

.search-btn {
  border: none;
  background-color: transparent;
  margin-left: auto;
  margin-right: 10px;
}

.main {
  min-height: calc(100vh - 100px);
}

.nav-menu {
  border-bottom: none !important;
}

.nav-menu-item {
  font-size: 1.25em;
  color: black !important;
}

.search-result-img {
  background-color: white;
  padding: 20px 20px 0px 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.search-result-card {
  background-color: ghostwhite;
  word-break: normal;
  color: black;
  padding: 0px 20px 20px 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.search-result-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.search-result-card-date {
  font-weight: bold;
}

.span-logo {
  padding-left: 10px;
  padding-top: 10px;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>

<style>
div.dialogSearch > div.el-dialog {
  background-color: #efefea;
}

@media only screen and (max-width: 991px) {
  div.dialogSearch > div.el-dialog {
    width: 90%;
  }
}
</style>