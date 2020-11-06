<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">Page non trouvée</h1>
    <h1 v-else>Une erreur est survenue</h1>
    <div>
        <NuxtLink to="/" class="no-text-decoration">Retour à l'accueil</NuxtLink>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error'],
  }
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: calc(100vh - 180px);
}
</style>