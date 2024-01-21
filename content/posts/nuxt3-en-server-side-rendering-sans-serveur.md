---
title: Nuxt 3 en SSR mais sans serveur ?!
description: Comment faire du rendu coté serveur sans avoir de serveur 🤯 ?! Grace au serverless et au FaaS 😉
author:
  name: flapili
  avatar: flapili.webp
archived: false
tags:
 - Nuxt3
 - VueJs
 - SSR
 - Web
 - FaaS
createdAt: "2022-09-26T05:51:13.588Z"
---

Bonjour !

Aujourd'hui un petit article pour vous montrer comment avec Nuxt3 faire du rendu coté serveur sans serveur 🤯<br>
Je pars du principe que vous êtes habitué à NodeJs et qu'il est installé.

PS: N'hésitez pas à donner votre avis sur le [discord](https://discord.flapili.fr), si vous voyez une coquille n'hésitez pas à la remonter 😋

# Qu'est ce que Nuxt

::messageBox{type="warning"}
Nuxt3 est en release candidate à l'heure où j'écris cet article.
::

::messageBox{type="info"}
Après beaucoups de bugs corrigés et de mauvaises 1ères impressions dissipées je fais cet article.<br>
Il y a encore pas si longtemps je voyais Nuxt3 d'un mauvais oeil pour plein de raison technique, mais maintenant Nuxt3 est en bonne phase 😁
::

Nuxt est décrit comme "le framework vue hybride" sur la [page principale](https://v3.nuxtjs.org/)<br>
Pour faire une analogie il est à VueJs ce que Next est à react ou encore SvelteKit à Selvte.

Si vous faites du vue3 mais que vous ne connaissez pas nuxt je vous conseille d'y jeter un oeil 😉

En gros les points forts de Nuxt:
- plusieurs modes de rendu
  - server side rendering
  - static site generation
  - single page app
  - mode hybride (pas encore dispo en RC11)
- auto import (`composable`, `components`, `layouts`)
- Configuration automatique de vue-router via l'arborescence des dossiers `pages` et `layouts`
- système de `plugins` & `modules`

# Installation de Nuxt (et de quelques autres trucs)

## installation de Nuxt

::messageBox{type="info"}
J'utilise pnpm plutôt que npm ou yarn, mais ça marche quasiment pareil.<br>
si jamais voici le [lien de la doc](https://v3.nuxtjs.org/getting-started/installation#new-project) de nuxt.
::

```bash
pnpm dlx nuxi init mon-super-project
```
Et on crée un fichier `.npmrc` où l'on va mettre `shamefully-hoist=true` (plus d'info au pourquoi du comment [ici](https://pnpm.io/fr/npmrc#shamefully-hoist))

## Quelques autres trucs
On installe un linter, avec la config d'[Antfu](https://antfu.me/) parce que j'aime bien cette configuation, en gros un linter c'est un outil qui te gueule dessus si y'a une virgule en trop ou en moins ou bien si y'a un console.log (pas exemple).

![exemple linter](/posts/nuxt3-en-server-side-rendering-sans-serveur/linter-exemple.png)

*par exemple avec l'extension eslint sur vscode*

```bash
pnpm -D i @antfu/eslint-config eslint typescript
```

Le package.json doit ressembler à un truc comme ça:
```json package.json
{
  "private": true,
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "devDependencies": {
    "@antfu/eslint-config": "^0.27.0",
    "eslint": "^8.23.1",
    "nuxt": "3.0.0-rc.11",
    "typescript": "^4.8.3"
  }
}
```

Et puis bah c'est bien beau d'installer des packages mais faut il encore les utiliser 😋

On crée un fichier `.eslintrc` à la racine du projet:
```json .eslintrc
{
  "extends": "@antfu"
}
```

# Un peu de code

## vue-router et app.vue

Pour activer vue-router dans Nuxt3 il suffit de créer un dossier `pages`, on va créer un fichier `index.vue` dedans:

```vue pages/index.vue
<script setup>
const { data } = await useAsyncData(() => new Date().toLocaleString())
</script>

<template>
  <div>
    bienvenue sur l'index, on est le {{ data }}
  </div>
</template>
```
Rien de bien compliqué, on demande au serveur une date, plus qu'à dire à Nuxt d'utiliser les pages: il suffit de modifier `app.vue`.
```vue app.vue
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

Si maintenant je vais sur http://localhost:3000/ j'ai bien `bienvenue sur l'index, on est le 24/09/2022, 14:16:00`<br>
Si par contre à la place je vais sur http://localhost:3000/page/qui/n/existe/pas j'ai bien une page d'erreur 404

# [NitroJs](https://nitro.unjs.io/), le moteur qui fait vroum vroum

[NitroJs](https://nitro.unjs.io/) est le moteur utilisé par Nuxt (et développé pour à la base), il permet de deployer votre code pour divers acteurs du cloud (Google, Amazon, Heroku, Netlify, etc...) je vais utiliser le deployment sur [firebase](https://firebase.google.com/products-build) qui est un produit Google, mais vous pouvez utiliser un autre acteur du cloud.

## Ajout des dépendances

Toujours avec pnpm chez moi
```bash
pnpm install -D firebase-admin firebase-functions firebase-functions-test
```

et `firebase-tools` en global avec npm cette fois car c'est un binaire qu'on installe globallement :
```bash
npm install -g firebase-tools
```

## Création d'un compte sur firebase et d'un projet

Bon je vous avous j'ai un peu la flemme de recréer un compte pour vous montrer comment ça marche mais c'est super simple, faut juste une carte bancaire (Google offre 300$ de crédit pour les 3 mois suivant, de quoi tester **G**oogle **C**loud **P**latform)

Une fois le projet créé (je vous assure y'en a pour 3 minutes chrono en main) il faut changer le type de facturation en Blaze pour pouvoir utiliser les clouds functions, c'est une formule où vous payez que ce que vous consommez.

![console firebase](/posts/nuxt3-en-server-side-rendering-sans-serveur/firebase-changement-facturation.png)

Les ([tarifs](https://firebase.google.com/pricing#blaze-calculator)) sont vraiment simples à comprendre et très accessible même à une large échelle, ça vous coutera bien moins cher qu'un VPS à titre d'exemple.

## firebase.json

Il n'y a plus qu'à créer un fichier `firebase.json` à la racine du projet :
```json firebase.json
{
  "functions": {
    "source": ".output/server"
  },
  "hosting": [
    {
      "site": "<votre_id_de_projet>",
      "public": ".output/public",
      "cleanUrls": true,
      "rewrites": [
        {
          "source": "**",
          "function": "server"
        }
      ]
    }
  ]
}
```
En remplacant la clef `hosting.site` par votre id de projet (pour moi `test-nuxt3-faas`) :

![console firebase](/posts/nuxt3-en-server-side-rendering-sans-serveur/id-projet.png)

## Login sur firebase
Pour se connecter il suffit de lancer `firebase login`, cela va vous ouvrir un nouvel onglet dans votre navigateur avec une page de connexion google classique.<br>

## Deployment
il n'y a plus que deux commandes à faire:
- `pnpm run build` pour générer le dossier `.output`
- `firebase deploy --project <votre_id_de_projet>` pour deployer chez Google

::messageBox{type="info"}
Si vous avez une erreur inconnue il faut aller dans le dossier **.output/server** et relancer un **npm i**.<br>
Plus d'info [ici](https://github.com/nuxt/framework/issues/4961).
::

Maintenant si je vais sur https://test-nuxt3-faas.web.app/ j'ai bien `bienvenue sur l'index, on est le 9/25/2022, 10:31:03 AM`, alors oui, je sais ... Le formatage est en Anglais, c'est normal la fonction à été deployée dans la région us-central1 du coup on a une locale en_US et si on va sur https://test-nuxt3-faas.web.app/blablabla on a bien la page 404 😉.

![screen erreur 404](/posts/nuxt3-en-server-side-rendering-sans-serveur/404.png)

# Bonus: avoir la bonne locale

On va utiliser le package negociator pour deviner la locale à utiliser
```bash
pnpm i negociator
pnpm i -D @types/negociator
```

Et on l'utilise
```html pages/index.vue
<script setup>
import Negotiator from 'negotiator'

const { data } = await useAsyncData(({ ssrContext }) => {
  if (process.server) {
    const negotiator = new Negotiator(ssrContext.event.req)
    const locale = negotiator.language(['fr-FR', 'en-US'])
    return new Date().toLocaleString(locale)
  }
  return new Date().toLocaleString()
})
</script>

<template>
  <div>
    bienvenue sur l'index, on est le {{ data }}
  </div>
</template>
```

Si je met le navigateur en Anglais j'ai `bienvenue sur l'index, on est le 9/25/2022, 11:09:25 AM` et en Français j'ai `bienvenue sur l'index, on est le 25/09/2022 11:12:54` and voilà !
