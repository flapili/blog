---
title: Déployer du code ES2015 avec NuxtJS
description: Vous aimeriez bien ne pas avoir à vous traîner des polyfills alors que vous êtes sous la dernière version de Chrome mais vous voulez que Michel avec Internet Explorer 11 puisse continuer de consulter votre site alors cet article pourrait bien vous être utile 😉
author:
    name: flapili
    avatar: flapili.webp
archived: false
image:
    src: modern_build.png
    alt: illustration d'un build moderne avec Nuxtjs
tags: javascript;babeljs;vuejs;nuxtjs;ES2015+;compatibilité IE;polyfill
createdAt: "2020-10-20T10:06:17.000Z" # facultatif
---

## ES2015, Polyfills, babel ... ça veut dire encore de nouvelles choses à apprendre ?!
Ne vous en faites pas on va voir ça ensemble 😉

### ES2015

* **Déjà ES ou EcmaScript pour les intimes :**<br>
C'est un ensemble de standards fourni par [Ecma International](https://fr.wikipedia.org/wiki/Ecma_International) qui vise les langages de type script tels que JavaScript ou encore ActionScript.

* **ES2015 et ES6, quel différence ?**<br>
On parle de la même chose, c'est la 6ème édition d'EcmaScript publié en juin 2015. C'est pourquoi elle est parfois appelée ES6, et parfois ES2015.

* **Compatibilité :**<br>
Comme vous le voyez ES6 est pris en charge sur la majorité des navigateurs récents (en même temps ça fait 5 ans 🙄).
<div style="text-align: center;">
  <a href="https://caniuse.com/es6">
    <img
      src="/posts/es6_compatibilité.png"
      alt="compatibilité des navigateurs avec ES6"
      loading="lazy"
      style="max-width: 100%;min-width: 50%;border-radius:10px;border: solid 1px black"
    >
  </a>
</div>



### Polyfills
les polyfills d'après [wikipedia](https://fr.wikipedia.org/wiki/Polyfill) :
> En [programmation web](https://fr.wikipedia.org/wiki/Programmation_web), un **polyfill** aussi nommé **shim**, ou encore **prothèse d'émulation** désigne un palliatif logiciel implémentant une rétrocompatibilité d’une fonctionnalité ajoutée à une [interface de programmation](https://fr.wikipedia.org/wiki/Interface_de_programmation) dans des versions antérieures de cette interface. Il s’agit généralement d’ensembles de fonctions, le plus souvent écrites en [JavaScript](https://fr.wikipedia.org/wiki/JavaScript) ou en [Flash](https://fr.wikipedia.org/wiki/Adobe_Flash), permettant de simuler sur un [navigateur web](https://fr.wikipedia.org/wiki/Navigateur_web) ancien des fonctionnalités qui n’y sont pas nativement disponibles.

... ouais ok je vais donner un exemple :<br>
imaginons qu'une nouvelle fonctionnalité trop cool vienne de sortir mais que certains de vos utilisateurs sont sur des navigateurs ne supportant pas ladite fonctionnalité. c'est ~~casse couille~~ embêtant.

**Mais comment faire ?**

On va faire une sorte de [Monkey-Patching](https://fr.wikipedia.org/wiki/Monkey-Patch), concrétement ça pourra ressembler à ça:
```js
window.maSuperFonctionnalite = function(arg1, arg2, ect) {
    // faire un truc super cool
}
```
Et ce bout de code sera chargé par le navigateur, ainsi si plus loin dans le programme vous avez besoin de window.maSuperFonctionnalite vous y avez accès.


**inconvénient**
* Le code du polyfill pourrait ne pas être optimal
* Ce n'est pas du code natif donc les performances seront légèrement moindre par rapport aux performances sur un navigateur qui supporte la fonctionnalité
* On écrase la version fournie par le navigateur
* Il faut télécharger le polyfill et l'appliquer

En quelque sorte on se met au niveau du plus faible (oui Internet Explorer c'est de toi que je parle) et ça a un coût.

### BabelJS

BabelJS est un transcompilateur, ce mot barbare veux dire que c'est un outil qui prend en entrée du code non compilé et en ~~dessert~~ sortie du code toujours non compilé mais écrit différemment, et les deux codes doivent produire le même résultat.

Concrètement si je prends une fonction fléchée
```js
maFonction = (nom) => {
    console.log("Bonjour " + nom )
}
```
Babel va me sortir

```js
"use strict";

maFonction = function maFonction(nom) {
  console.log("Bonjour " + nom);
};
```
C'est pareil sauf que les vieux navigateurs comprennent.<br>
Maintenant un autre exemple avec du async/await et on rigole déjà moins :
```js
maFonctionAsync = async (arg) => {
    await Promise.resolve(arg)
}
```
Oh c'est tout mignon ça doit prendre 5 lignes max non ... non ? **NON !**

```js
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

maFonctionAsync = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(arg) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Promise.resolve(arg);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function maFonctionAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();
```

**inconvénient**
* Le code généré n'est pas optimal
* Le code est plus lourd, il mettra donc plus de temps à être téléchargé

Et vous savez quoi ?<br>
Les polyfills eux mêmes peuvent avoir besoin d'être transpilé. Et dans les codes transpilés il peut y avoir besoin de pollyfills...

<div style="text-align: center;">
    <img
      src="https://i.giphy.com/media/26xBI73gWquCBBCDe/giphy.webp"
      alt="Math"
      loading="lazy"
      style="max-width: 100%;min-width: 50%;border-radius:10px;border: solid 1px black;"
    >
</div>


## Mode modern chez VueJS et NuxtJS

Petit rappel: on veut à la fois que les utilisateurs de navigateurs anciens aient les polyfills et le build transpillé tandis que les navigateurs récent ne doivent pas les avoir.<br>
Nous allons donc avoir 2 builds: un moderne et un legacy

### Le flag `--modern` à la rescousse

#### chez VueJS
VueJS offre un moyen extrêmement simple de faire tout ça grâce au flag `--modern`, webpack (on en parlera un jour promis) va donc générer deux builds: un build "modern" et un build "legacy".

Si l'on regarde ce que webpack crache en sorti on va avoir:
```html
<!doctype html>
<html data-n-head-ssr lang="fr" data-n-head="%7B%22lang%22:%7B%22ssr%22:%22fr%22%7D%7D">
  <head>
    [...]
    <link rel="modulepreload" href="/_nuxt/c0bcacc.modern.js" as="script">
    <link rel="modulepreload" href="/_nuxt/ba0971c.modern.js" as="script">
    <link rel="modulepreload" href="/_nuxt/edcde26.modern.js" as="script">
    <link rel="modulepreload" href="/_nuxt/0907d2b.modern.js" as="script">
    <link rel="modulepreload" href="/_nuxt/26edac4.modern.js" as="script">
    [...]
  <head>

  [...]
  <script nomodule src="/_nuxt/177b217.js" defer></script>
  <script type="module" src="/_nuxt/c0bcacc.modern.js" defer></script>
  <script nomodule src="/_nuxt/2550638.js" defer></script>
  <script type="module" src="/_nuxt/26edac4.modern.js" defer></script>
  <script nomodule src="/_nuxt/d764faa.js" defer></script>
  <script type="module" src="/_nuxt/ba0971c.modern.js" defer></script>
  <script nomodule src="/_nuxt/5beb621.js" defer></script>
  <script type="module" src="/_nuxt/edcde26.modern.js" defer></script>
  <script nomodule src="/_nuxt/abdbdac.js" defer></script>
  <script type="module" src="/_nuxt/0907d2b.modern.js" defer></script>
```
Les navigateurs comprenant l'attribut `type="module"` vont charger le script correspondant au build modern et ne vont pas charger les scripts avec l'attribut `nomodule` tandis que les vieux navigateurs ne comprendront pas l'attribut `type="module"` et chargeront donc le build legacy (compatible IE9 par défaut)
<infobox>Un <a href="https://caniuse.com/es6-module">bug</a> est présent sous safari 10.1 et safari 10.3 iOS fait que Safari charge quand même les scripts nomodule, heureusement VueJS applique un fix.</infobox>

#### Le cas de Nuxt
Nuxt offre également un moyen de faire ça :

* `--modern`<br>
Lorsque ce flag est mis en mode SSR (**S**erver **S**ide **R**endering) le serveur de rendu servira le build en fonction de l'user-agent du navigateur.<br>
Sinon en mode SPA (**S**ingle **p**age **A**pplication) ou SSG (**S**erver **S**ide **G**enerate) le fonctionnement est le même que celui avec Vuejs.

* `--modern=server`<br>
Le serveur NodeJS servira le build en fonction de l'user-agent.<br>
<warningbox>Uniquement disponible en mode SSR.</warningbox>

* `--modern=client`<br>
Même fonctionnement que celui de Vuejs.<br>
<infobox>disponible avec tous les modes.</infobox>

## Quel Gain ?

* Gain d'environ 20% sur la taille du build chez moi
* ~20% de bande passante utilisé en moins (j'auto héberge le site sur mon ADSL 😥),
* votre site charge donc ~20% plus vite
* meilleurs performances puisqu'on ne se trimbale pas les polyfills ni le code transpillé

Bien sur le gain pourra varier d'environ plus ou moins 5% je dirais que c'est toujours ça de pris.<br>
de même le gain étant relatif, si vous avez 300mo d'assets il est clair que vous n'aurez pas 20% de gain sur la taille finale du build, seulement 20% sur le JavaScript.

Alors, pas cher payé pour une dizaine de caractères hein ?

<div style="text-align: center;">
    <img
      src="https://media1.tenor.com/images/a29353c4ff3f57e76fee8e9ad460e1c8/tenor.gif"
      alt="clin d'oeil"
      loading="lazy"
      style="max-width: 100%;min-width: 50%;border-radius:10px;border: solid 1px black;"
    >
</div>

Pour aller plus loin :
* [VueJs - Browser Compatibility](https://cli.vuejs.org/guide/browser-compatibility.html#modern-mode)
* [NuxtJs - API: La propriété modern](https://fr.nuxtjs.org/api/configuration-modern/)
* [Deploying ES2015+ Code in Production Today](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)