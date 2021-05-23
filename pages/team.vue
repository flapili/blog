<template>
  <div class="container">
    <h1>Notre équipe</h1>
    <div class="flex flex-wrap">
      <div
        v-for="(member, indexMember) in members"
        :key="`indexMember-${indexMember}`"
        class="member-container flex"
      >
        <div class="member flex flex-column">
          <div class="flex">
            <nuxt-img
              :src="`/author/${member.avatar}`"
              class="member-avatar"
              width="128"
              height="128"
            />
            <ul class="member-roles flex flex-wrap">
              <li
                v-for="(role, indexMemberRole) in member.roles"
                :key="`indexMemberRole-${indexMemberRole}`"
                class="member-role"
              >
                {{ role }}
              </li>
            </ul>
          </div>
          <h2>{{ member.name }}</h2>
          <nuxt-content :document="member" class="member-bio" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
.container {
  margin: 0px 10%;
}

.member-container {
  width: calc(100% / 3);
  min-height: 600px;
}

@media only screen and (max-width: 991px) {
  .container {
    margin: 0px 5%;
  }
  .member-container {
    width: 100%;
  }
}
.member {
  margin: 20px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  border: 2px solid black;
}

.member-avatar {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-right: 2px solid black;
  border-bottom: 2px solid black;
}

.member-roles {
  margin: 0px;
  padding: 0px;
}

.member-role {
  display: flex;
  /* border: 1px solid black; */
  border-radius: 5px;
  height: 30px;
  padding: 0px 10px;
  margin: 3px;
  border: 2px solid gray;
  background-color: #efefef;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
}

.member-bio {
  width: 100%;
  font-size: 1.25rem;
}
</style>