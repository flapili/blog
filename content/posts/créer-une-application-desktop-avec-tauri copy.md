---
title: Créer une application Desktop avec Tauri avec une stack web
description: TODO
author:
  name: flapili
  avatar: flapili.webp
archived: true
tags:
 - Tauri
 - Application
createdAt: "2022-07-19T20:31:50.476Z"
---
[[toc]]

Aujourd'hui un petit article pour présenter [Tauri](https://tauri.app) 😉<br/>
Il s'agit d'une simple présentation, il n'y aura rien de complexe 😅

# Présentation

## Qu'est ce que Tauri ?
d'après la page de présentation :
>Tauri is a toolkit that helps developers make applications for the major desktop platforms - using virtually any frontend framework in existence. The core is built with Rust, and the CLI leverages Node.js making Tauri a genuinely polyglot approach to creating and maintaining great apps.

Bon, si on traduit à coup de truelle en gros Tauri ça permet de faire des applications pour les majeurs OS (sous entendre Windows, Linux et MacOs) - Compatible avec n'importe quelle technologie Frontend. Écrit en Rust avec une CLI utilisant les forces de NodeJs, faisant de Tauri une approche polyglote (basé sur plusieurs langages) ingénieuse pour créer et maintenir de supers applications.

Pour faire encore plus simple vous donnez du HTML/CSS/JS à manger à Tauri et lui va en faire une application, il suffit d'un outil/bibliotèque

## Mais attends ? Et electon alors ?!
Alors je vais être honnete j'ai jamais vraiment utilisé electron à fond, en général je prenais des boileplates tout près et basta.

La plus notable des différences c'est que Tauri s'appuit sur le "navigateur interne" de l'OS, plutôt que d'avoir un chromium à coté.<br/>
un hello world c'est moins de 3mo sous windows, avec electron même un hello world doit être facilement 20x plus lourd.

## Par contre ça demande peu de prérequis
Tauri est écrit en Rust vous aurez donc besoin de ~~perl~~ la toolchain de compilation Rust<br/>
Je ne vais pas décrire ici comment setup tout ça la [doc](https://tauri.app/v1/guides/getting-started/prerequisites) est très bien faites 😉.
<!-- Créer dossier dist -->

# Du concret

## Les sources web

En général les frameworks frontend génèrent un dossier `dist`, on va donc le créer

```shell
mkdir dist
```

Voilà l'application qu'on va vouloir packagée en application bureau, attention c'est très complexe 🙄


```shell:structure
.
└─dist
  ├─ index.html
  ├─ ma-super-page.html
  └─ style.css
```

```html:index.html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Super Projet</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div>Mon super projet</div>
    <a href="./ma-super-page.html">Ma page</a>
</body>

</html>
```

```html:ma-super-page.html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Super Projet</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div>Mon super projet - page</div>
    <a href="./index.html">Acceuil</a>
</body>

</html>
```

```css:style.css
body,
html {
    margin: 0px;
    padding: 0px;
}

body {
    height: 100vh;
    background-color: #dfdfdf;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
}
```

Resultat :
<ContentImage src="/posts/tauri-demo.jpg" alt="tauri demo" />
<ContentImage src="https://c.tenor.com/It6WN9CY4HMAAAAC/wow-oh-my-god.gif" alt="wow" />


## installation de la CLI de Tauri
### avec pnpm
*Perso j'utilise pnpm comme package manager*
```shell:pnpm
pnpm i --D @tauri-apps/cli
```

### avec npm
```shell:npm
npm i --save-dev @tauri-apps/cli
```

### avec yarn
```shell:yarn
yarn add -D @tauri-apps/cli
```

## Initialisation

TODO:
