<template>
  <div>
    <el-row type="flex">
      <el-col :md="{ span: 16, offset: 4 }">
        <el-card
          class="no-border"
          style="background-color: rgba(255, 255, 255, 0.2)"
        >
          <h1 class="text-center title-page">
            <XyzTransitionGroup
              xyz="fade small stagger-1 duration-15"
              appear
              class="splitting"
            >
              <span v-for="(c, i) in 'Bienvenue sur flapili.fr'" :key="i">
                <template v-if="c == ' '">&nbsp;</template>
                <template v-else>{{ c }}</template>
              </span>
            </XyzTransitionGroup>
          </h1>
        </el-card>
      </el-col>
    </el-row>
    <XyzTransitionGroup appear xyz="fade small duration-30 stagger-2">
      <el-row type="flex" style="margin-top: 16px" key="1">
        <el-col :md="{ span: 16, offset: 4 }">
          <el-card
            shadow="hover"
            class="transparent-card"
            style="text-align: justify"
          >
            <h3>Chers développeurs,</h3>
            <h5>Intro</h5>
            <p>
              Ce site a été entièrement réalisé par des passionnés
              d'informatique qui ont pour vocation de transmettre leurs
              connaissances sur des sujets aussi précis que variés. Cette équipe
              de rédacteurs et de designers est à votre écoute pour toute idée
              sur le fonctionnement du site. Le projet étant Open Source il est
              consultable depuis Github.
            </p>

            <h5>Collaboration</h5>
            <p>
              Il est très simple de collaborer en intégrant vos articles sur le
              site internet. En effet vous pouvez très simplement "Forker" le
              projet et le modifier à votre guise. Reconnaissez qu'il est
              tellement mieux de discuter avec les membres du discord qui
              sauront vous guider. Un article ne se fait pas en un jour ni même
              en une nuit c'est un travail long et fastidieux...
            </p>

            <div style="text-align: center">
              Sur ceux vous êtes les Bienvenus, l'équipe vous souhaite une bonne
              visite!
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row type="flex" style="margin-top: 16px" key="2">
        <el-col :md="{ span: 16, offset: 4 }">
          <el-card shadow="hover" class="transparent-card">
            <div class="text-center">
              <strong>Rejoignez le discord</strong><br />
              <a
                href="https://discord.flapili.fr"
                target="_blank"
                rel="nofollow noopener"
              >
                <font-awesome-icon
                  :icon="['fab', 'discord']"
                  size="8x"
                  style="color: #8c9eff"
                /> </a
              ><br />
              <i>L'équipe a besoin de vous !</i>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </XyzTransitionGroup>
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