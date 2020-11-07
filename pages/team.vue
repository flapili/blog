<template>
  <el-row>
    <el-col :md="{ span: 16, offset: 4 }">
      <el-card
        class="no-border"
        style="background-color: rgba(255, 255, 255, 0.2)"
      >
        <h1 class="text-center title-page">L'équipe</h1>
      </el-card>

      <!-- <el-card shadow="hover" style="margin-top: 16px;"> -->
      <el-card v-for="(member, i) in members" :key="i" class="member-card transparent-card">
        <div class="flex" :class="{ 'flex-row-reverse': i % 2 == 1 }">
          <!-- image -->
          <el-avatar
            :size="100"
            :src="`/author/${member.avatar}`"
            style="min-width: fit-content"
          ></el-avatar>

          <div>
            <!-- name -->
            <div class="flex" :class="{ 'flex-row-reverse': i % 2 === 1 }">
              <h1 class="name">{{ member.name }}</h1>
              <div
                v-if="member.roles"
                :class="
                  i % 2 === 0 ? 'role-container-left' : 'role-container-right'
                "
              >
                <!-- roles -->
                <el-tag
                  v-for="(role, i_roles) in member.roles"
                  :key="i_roles"
                  class="role"
                  :class="i % 2 === 1 ? 'role-left' : 'role-right'"
                  effect="dark"
                  type="info"
                >
                  {{ role }}
                </el-tag>
              </div>
            </div>

            <!-- bio -->
            <!-- <p style="margin: 0 10px; text-align: justify"> -->
            <nuxt-content
              :document="member"
              style="text-align: justify; margin: 0 10px"
            />
            <!-- </p> -->
          </div>
        </div>
        <!-- </el-card> -->
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  head() {
    return {
      title: "L'équipe - flapili.fr",
    };
  },

  async asyncData({ $content }) {
    const members = await $content("team")
      .only(["createdAt", "name", "avatar", "bio", "roles", "body"])
      .sortBy("createdAt", "asc")
      .where({ active: true })
      .fetch();
    return {
      members: members,
    };
  },
};
</script>

<style scoped>
.name {
  margin-block-start: 0;
  margin-block-end: 0;
}

.role-container-left {
  margin-left: 10px;
}

.role-container-right {
  margin-right: 10px;
}

.role-left {
  margin-left: 4px;
}

.role-right {
  margin-right: 4px;
}

.member-card {
  margin-top: 16px;
}
</style>