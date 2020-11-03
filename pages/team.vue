<template>
  <el-row>
    <el-col :md="{ span: 16, offset: 4 }">
      <el-card shadow="hover">
        <h1 class="text-center">L'équipe</h1>
      </el-card>

      <el-card shadow="hover" style="margin-top: 16px;">
        <el-card
          v-for="(member, i) in members"
          :key="i"
          :class="{'member-card': i > 0}"
        >
          <div class="flex" :class="{ 'flex-row-reverse': i % 2 == 1 }">
            <!-- image -->
            <el-avatar
              :size="100"
              :src="`/author/${member.avatar}`"
              style="min-width: fit-content;"
            ></el-avatar>

            <div>
              <!-- name -->
              <h1 class="name">{{ member.name }}</h1>

              <!-- bio -->
              <p style="margin: 0 10px 0 10px;">
                {{ member.bio }}
              </p>
            </div>
          </div>
        </el-card>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const members = await $content("team")
      .only(["createdAt", "name", "avatar", "bio"])
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

.member-card {
  margin-top: 16px;
}

</style>