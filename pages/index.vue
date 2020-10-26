<template>
  <div>
    <el-row>
      <el-col :md="{ span: 16, offset: 4 }">
        <el-card shadow="hover">
          <h1 class="text-center">Bienvenue sur mon site perso !</h1>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :md="{ span: 4, offset: 5 }">
        <nuxt-link to="/bio" class="no-text-decoration">
          <el-card shadow="hover" class="text-center">
            Biographie
            </el-card>
        </nuxt-link>
      </el-col>
      <el-col :md="{ span: 4, offset: 1 }">
        <nuxt-link to="/cv" class="no-text-decoration">
          <el-card shadow="hover" class="text-center">
            Curriculum Vitae
          </el-card>
        </nuxt-link>
      </el-col>
      <el-col :md="{ span: 4, offset: 1 }">
        <nuxt-link to="/posts" class="no-text-decoration">
          <el-card shadow="hover" class="text-center">
            Posts
            </el-card>
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>
