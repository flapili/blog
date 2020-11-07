<template>
  <div>
    <el-row type="flex">
      <el-col :md="{ span: 16, offset: 4 }">
        <el-card
          class="no-border"
          style="background-color: rgba(255, 255, 255, 0.2)"
        >
          <h1 class="text-center title-page">Bienvenue sur flapili.fr</h1>
        </el-card>
      </el-col>
    </el-row>

    <el-row type="flex" style="margin-top: 16px">
      <el-col :md="{ span: 16, offset: 4 }">
        <el-card shadow="hover" class="transparent-card" style="text-align: justify">
          Laboris ipsum dolor labore qui irure proident esse ut duis. Commodo
          occaecat esse exercitation ad. Laboris qui ex id minim laborum veniam
          eiusmod ea sunt quis reprehenderit ea. Cillum elit tempor cillum
          labore qui aliquip consequat incididunt excepteur cupidatat ullamco
          dolore adipisicing. Id officia duis tempor incididunt eiusmod. Sit
          nisi laborum qui esse cillum laborum magna cillum ullamco aliqua
          ullamco sint aute. Ex aliqua enim eiusmod enim do id eiusmod eiusmod
          anim non.<br /><br />
          Nulla voluptate elit nisi eiusmod elit pariatur eu enim. Elit ad qui
          ex sunt aliqua occaecat aliqua pariatur ullamco. Aute occaecat ad amet
          mollit aliqua Lorem deserunt velit. Excepteur irure ipsum tempor
          exercitation est pariatur veniam qui reprehenderit.<br /><br />
          Et est Lorem cupidatat proident labore sunt elit nostrud magna eu.
          Reprehenderit do laborum in in. Minim aute tempor ad cillum in
          adipisicing enim veniam sunt cupidatat reprehenderit. Ex ut sunt
          reprehenderit mollit ex cupidatat excepteur quis tempor eu nisi qui.
          Adipisicing velit fugiat tempor dolor qui est. Exercitation sint culpa
          ut amet commodo.<br /><br />
          Incididunt aliquip sit aliquip est tempor commodo irure. Veniam
          excepteur commodo laborum reprehenderit. Dolore dolor nostrud nisi non
          ad ut do in est eiusmod. Ipsum quis consectetur culpa laboris. Sint
          tempor culpa do officia adipisicing nostrud minim qui. Adipisicing
          eiusmod Lorem Lorem qui adipisicing consectetur officia velit eiusmod
          pariatur commodo tempor laboris. Cupidatat minim ea officia cupidatat
          cillum aliquip elit enim excepteur nisi.<br /><br />
          Ut ullamco aute culpa in occaecat laborum velit aliqua anim nostrud
          nulla do. Voluptate fugiat tempor in ea esse ex culpa dolore. Ea
          ullamco enim do aute culpa adipisicing aliqua elit. Veniam ullamco
          duis esse fugiat irure exercitation quis occaecat. Sint mollit velit
          sunt nisi dolore dolore aute in culpa tempor. Velit elit est mollit
          adipisicing consequat voluptate consequat fugiat ullamco magna cillum
          ex. Voluptate eu tempor ex duis magna deserunt irure ipsum.
        </el-card>
      </el-col>
    </el-row>

    <el-row type="flex" style="margin-top: 16px">
      <el-col :md="{ span: 16, offset: 4 }">
        <el-card shadow="hover" class="transparent-card">
          <div class="text-center">
            <strong>Rejoignez le discord</strong><br />
            <a href="https://discord.flapili.fr" target="_blank" rel="nofollow noopener">
              <font-awesome-icon
                :icon="['fab', 'discord']"
                size="8x"
                style="color: #8c9eff"
              /> </a
            ><br />
            <i>On a besoin de vous !</i>
          </div>
        </el-card>
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