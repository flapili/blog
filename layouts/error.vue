<template>
  <div class="container">
    <h1 class="status-code">{{ error.statusCode }}</h1>
    <h2 class="message">{{ error.message }}</h2>
    <NuxtLink to="/" class="no-text-decoration" style="color: #23a8f2">
      <font-awesome-icon
        :icon="['fas', 'home']"
        size="5x"
      />
      <br>
      <span style="font-size: 2em">
        Accueil
      </span>
      
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: ["error"],
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  height: calc(100vh - 180px);
}

.status-code {
  font-size: 8em;
  margin: 0px;
}

.message {
  margin-top: 0px;
}
</style>