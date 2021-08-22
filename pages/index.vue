<template>
  <div>
    <el-row class="row">
      <el-col
        :md="12"
        class="flex"
        style="align-items: center; justify-content: center"
      >
        <img src="/laptop_S_200x200.png" />
        <img src="/tea_S_80x80.png" />
      </el-col>
      <el-col :md="12">
        <h1 class="title">FLAPILI.FR</h1>
        <h2 class="subtitle">BLOG DE L'INFO</h2>
        <nuxt-link to="/posts">
          <el-button class="discover-btn btn">DÉCOUVRIR</el-button>
        </nuxt-link>
      </el-col>
    </el-row>

    <el-row style="margin-top: 5%">
      <el-col :md="{ offset: 7, span: 10 }">
        <p class="text-justify">
          Ce site a été entièrement réalisé par des passionnés d'informatique
          bénévoles qui ont pour vocation de transmettre leurs connaissances sur
          des sujets aussi précis que variés. Cette équipe de rédacteurs et de
          designers est à votre écoute pour toute idée sur le fonctionnement du
          site. Le projet étant Open Source il est consultable depuis Github.
        </p>
        <p class="text-justify">
          Il est très simple de publier vos articles sur le site internet. En
          effet vous pouvez très simplement fork le projet sur Github et
          commencer à écrire un article. Reconnaissez qu'il est tellement mieux
          de discuter avec les membres du discord qui sauront vous guider.
        </p>
      </el-col>
    </el-row>

    <el-row style="margin-top: 8%">
      <el-col
        :md="{ span: 6, offset: 6 }"
        class="flex"
        style="justify-content: center"
      >
        <a
          href="https://discord.flapili.fr"
          target="_blank"
          rel="nofollow noopener"
        >
          <el-button class="discord-btn btn">
            <font-awesome-icon :icon="['fab', 'discord']" /> DISCORD
          </el-button>
        </a>
      </el-col>
      <el-col :md="6" class="flex" style="justify-content: center">
        <a
          href="https://github.com/flapili/blog"
          target="_blank"
          rel="nofollow noopener"
        >
          <el-button class="github-btn btn">
            <font-awesome-icon :icon="['fab', 'github']" /> GITHUB
          </el-button>
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "Accueil - flapili.fr",
    };
  },
};
</script>

<style scoped>
.title {
  font-size: 4rem;
  margin: 0px;
  letter-spacing: 0.3rem;
}

.subtitle {
  font-size: 1.5rem;
  margin: 0px;
  letter-spacing: 0.3rem;
}
.row {
  margin-top: 3%;
}

@media only screen and (max-width: 991px) {
  .row {
    margin: 0px;
  }
  .github-btn {
    margin-top: 5%;
  }
}

.btn {
  height: 60px;
  width: 230px;
  color: black;
  font-weight: bold;
  font-size: 1.25rem;
  letter-spacing: 0.2rem;
  border-radius: 30px;
}

.discover-btn {
  margin-top: 30px;
}

.discover-btn,
.discord-btn {
  background-color: #f29100;
}

.github-btn {
  border: 2px solid #f29100;
}
</style>