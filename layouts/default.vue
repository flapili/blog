<template>
  <div>
    <el-container>
      <el-header class="header">
        <el-collapse-transition>
          <span class="flex" v-if="show_menu">
            <el-menu
              mode="horizontal"
              background-color="transparent"
              text-color="#fff"
              active-text-color="#ffd04b"
              class="nav-menu"
              :default-active="activeIndex"
              router
            >
              <el-menu-item index="/" class="nav-menu-item">
              <el-image
              src="/logo.webp"
              fit="cover"
              class="logo"
              alt="logo"
            ></el-image>
              </el-menu-item>
              <el-menu-item index="/team" class="nav-menu-item">
                L'équipe
              </el-menu-item>
              <el-menu-item index="/posts" class="nav-menu-item">
                Posts
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
        <nuxt />
      </el-main>

      <el-footer class="footer text-center">
        © {{ $dayjs().format("YYYY") }} flapili.fr
        <div>
          <a
            href="https://github.com/flapili/blog"
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
  computed: {
    activeIndex() {
      return this.$store.state["menu-active-item"].activeIndex;
    },
  },
};
</script>

<style scoped>

.header {
  padding: 0;
  display: flex;

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

.nav-menu {
  border-bottom: none;
}

.nav-menu-item {
  font-size: 1.25em;
}
.bouton-disable-nav-menu {
  display: none;
  background-color: transparent;
  margin-left: auto;
  border: none;
  font-size: 2em;
  color: #ffd04b;
}

@media only screen and (max-width: 275px) {
  .bouton-disable-nav-menu {
    display: block;
  }
  .nav-menu-item {
    float: none;
    z-index: 1;
    background-color: white !important;
    color: black !important;
    mix-blend-mode: difference;
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