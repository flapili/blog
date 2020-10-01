<template>
  <div>
    <el-container class="background">
      <el-header class="header">
        <el-row class="background">
          <el-col :md="{ span: 8, offset: 8}">
            <el-menu
              mode="horizontal"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              class="nav-menu"
            >
              <el-menu-item index="1" class="nav-menu-item">Accueil</el-menu-item>
              <el-menu-item index="2" class="nav-menu-item">Bio</el-menu-item>
              <el-menu-item index="3" class="nav-menu-item">CV</el-menu-item>
              <el-menu-item index="4" class="nav-menu-item">
                <nuxt-link to="/posts" class="no-text-decoration">Posts</nuxt-link>
                
              </el-menu-item>
            </el-menu>            
          </el-col>
          <el-col></el-col>
        </el-row>

      </el-header>

      <el-main class="main">
        <el-row>
          <el-col :lg="{ span: 16, offset: 4 }">
            <Nuxt />
          </el-col>
        </el-row>
      </el-main>

      <el-footer class="footer text-center">
        © {{ $dayjs().format("YYYY") }} flapili.fr
        <div>
          <a href="https://nuxtjs.org" target="_blank" style="color: inherit">
            <font-awesome-icon :icon="['fab', 'github']" size="2x" />
          </a>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>


<script>
  export default {
    computed: {
      articles() {
        return this.$store.state.articles.articles
      }
    },

    async fetch() {
      const last_articles = await this.$content("articles")
        .only(["title", "updatedAt", "author", "description"])
        .sortBy("updatedAt", "desc")
        .limit(10)
        .fetch()

      await this.$store.commit('articles/update_last', last_articles)
    },
  };
</script>

<style scoped>
  .background {
    background-color: gainsboro;
  }

  .main {
    min-height: 100vh;
    min-height: calc(100vh - 120px);
  }

  .footer {
    background-color: silver;
    height: 10px;
  }

  .nav-menu-item {
    font-size: 1.25em;
  }

  .nav-menu-item:first-child {
    border-bottom-left-radius: 25px;
  }

  .nav-menu {
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    }
</style>