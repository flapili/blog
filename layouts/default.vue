<template>
  <div>
    <el-container class="background">
      <el-header class="header">
        <span class="flex span-logo">
          <el-image :src="require(`~/assets/logo.webp`)" fit="cover" class="logo"></el-image>
        </span>
        
        <span class="flex">
          <el-menu
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            class="nav-menu"
          >
            <el-menu-item index="1" class="nav-menu-item">
              <nuxt-link to="/" class="no-text-decoration block">Accueil</nuxt-link>
              </el-menu-item>
            <el-menu-item index="2" class="nav-menu-item">Bio</el-menu-item>
            <el-menu-item index="3" class="nav-menu-item">CV</el-menu-item>
            <el-menu-item index="4" class="nav-menu-item">
              <nuxt-link to="/posts" class="no-text-decoration block">Posts</nuxt-link>
            </el-menu-item>
          </el-menu> 
        </span>
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
    min-height: calc(100vh - 120px);
  }

  .footer {
    background-color: silver;
    height: 10px;
  }

  .nav-menu-item {
    font-size: 1.25em;
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