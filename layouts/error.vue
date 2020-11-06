<template>
  <div class="container">
    <div v-if="error.statusCode === 404">
     <h1 class="not-found-error-code">404</h1>
     <h1 class="not-found-message">Page non trouvée</h1>
    </div>

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

<style scoped>
.not-found-error-code {
    text-align: center;
    font-size: 8em;
    margin-block-start: 0;
    margin-block-end: 0;
}
.not-found-message {
    text-align: center;
    margin-block-start: 0;
    margin-block-end: 0;
}
</style>