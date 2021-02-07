<template>
  <el-row>
    <el-col :md="{ span: 16, offset: 4 }">
      <el-card style="background-color: darkgray">
        <h1 class="text-center title-page">
          <XyzTransitionGroup
            appear
            xyz="fade small duration-5 up"
            class="splitting"
            style="--xyz-stagger: 0.05s"
          >
            <span v-for="(c, i) in `L'équipe`" :key="i">
              <template v-if="c == ' '">&nbsp;</template>
              <template v-else>{{ c }}</template>
            </span>
          </XyzTransitionGroup>
        </h1>
      </el-card>

      <XyzTransitionGroup
        appear
        class="square-grid"
        xyz="fade small duration-5 stagger-2"
      >
        <el-card v-for="(member, i) in members" :key="i" class="member-card">
          <el-image
            :src="`/author/${member.avatar}`"
            class="avatar"
            :style="{ float: i % 2 === 0 ? 'left' : 'right' }"
          />
          <div :style="{ 'text-align': i % 2 === 0 ? 'left' : 'right' }">
            <h2 v-if="i % 2 === 0" class="name">{{ member.name }}</h2>
            <el-tag
              v-for="(role, i_roles) in member.roles"
              :key="i_roles"
              class="role"
              effect="plain"
              type="info"
            >
              {{ role }}
            </el-tag>
            <h2 v-if="i % 2 === 1" class="name">{{ member.name }}</h2>

            <nuxt-content
              :document="member"
              style="text-align: justify; margin: 0 10px"
            />
          </div>
        </el-card>
      </XyzTransitionGroup>
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
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border: 1px solid black;
}

.name {
  margin-bottom: 0px;
  margin-top: 5px;
  display: inline;
  font-size: 2em;
}

.role {
  margin-left: 2px;
  margin-right: 2px;
}

.member-card {
  margin-top: 16px;
  min-height: 140px;
  background-color: darkgray;
  border-color: black;
}
</style>