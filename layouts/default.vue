<template>
  <div>
    <el-container class="background">
      <el-header class="header">
        <nuxt-link to="/">
          <span class="flex span-logo">
            <el-image
              src="/logo.webp"
              fit="cover"
              class="logo"
            ></el-image>
          </span>
        </nuxt-link>

        <el-collapse-transition>
          <span class="flex" v-if="show_menu">
            <el-menu
              mode="horizontal"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              class="nav-menu"
            >
              <el-menu-item index="1" class="nav-menu-item">
                <nuxt-link to="/" class="no-text-decoration block"
                  >Accueil</nuxt-link
                >
              </el-menu-item>
              <el-menu-item index="2" class="nav-menu-item">Bio</el-menu-item>
              <el-menu-item index="3" class="nav-menu-item">CV</el-menu-item>
              <el-menu-item index="4" class="nav-menu-item">
                <nuxt-link to="/posts" class="no-text-decoration block"
                  >Posts</nuxt-link
                >
              </el-menu-item>
            </el-menu>
          </span>
        </el-collapse-transition>
        <el-button
          @click="show_menu = !show_menu"
          class="bouton-disable-nav-menu"
          ><i :class="show_menu ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i
        ></el-button>
      </el-header>

      <el-main class="main">
        <Nuxt />
      </el-main>

      <el-footer class="footer text-center">
        © {{ $dayjs().format("YYYY") }} flapili.fr
        <div>
          <a
            href="https://github.com/flapili"
            target="_blank"
            style="color: inherit"
          >
            <font-awesome-icon :icon="['fab', 'github']" size="2x" />
          </a>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show_menu: true,
    };
  },
};
</script>

<style scoped>
.background {
  background-color: gainsboro;
}

.header {
  padding: 0;
  display: flex;
  background-color: #545c64;
}

.main {
  min-height: 100vh;
  min-height: calc(100vh - 140px);
}

.footer {
  background-color: silver;
  height: 80px !important;
  padding-top: 10px;
}

.nav-menu-item {
  font-size: 1.25em;
}
.bouton-disable-nav-menu {
  display: none;
  background-color: #545c64;
  margin-left: auto;
  border: none;
  font-size: 2em;
  color: #ffd04b;
}

@media only screen and (max-width: 363px) {
  .bouton-disable-nav-menu {
    display: block;
  }
  .nav-menu-item {
    float: none;
    z-index: 1;
  }
}

.span-logo {
  padding-left: 10px;
  padding-top: 10px;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}
</style>