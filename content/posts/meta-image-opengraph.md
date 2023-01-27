---
title:  Meta image openGraph via un service de capture
description: Comment faire des screenshots de pages web pour les metas openGraph, toujours sans serveur 🤯 ?! Grace au serverless et à Cloud Run 😉
author:
  name: flapili
  avatar: flapili.webp
archived: false
tags:
 - Nuxt3
 - Firebase
 - Cloud Run
 - Web
 - Playwright
 - FaaS
createdAt: "2023-01-27T12:08:42.017Z"
---
[[toc]]

Hello World !

La dernière fois on a setup Nuxt3 en SSR avec du rendu sur des fonctions firebase, aujourd'hui on va voir comment ajouter un service de capture pour les metas openGraph (en gros quand vous partagez le lien sur un réseau social ça va prendre un screenshot de la page)

PS: N'hésitez pas à donner votre avis sur le [discord](https://discord.flapili.fr), si vous voyez une coquille n'hésitez pas à la remonter 😋

# Service de capture

J'utilise FastAPI + Playwright pour faire le service mais vous pouvez utiliser ce que vous voulez.

On fait un dossier `capture` et on y met 3 fichiers :
- Dockerfile
- requirements.txt
- main.py

## Dockerfile

```docker:capture/Dockerfile
# On commence de l'image officiel de playwright
FROM mcr.microsoft.com/playwright/python:v1.30.0-focal

# Pour avoir les logs en temps réel dans GCP
ENV PYTHONUNBUFFERED True

On récupère le fichier qui décrit les dépendances et on les installes
COPY requirements.txt ./
RUN python3 -m pip install --no-cache-dir -r requirements.txt

# on install un binaire chromium grace à Playwright
RUN python3 -m playwright install chromium

# On copie les sources
COPY main.py ./

# enfin on donne la commande à lancer
CMD [ "uvicorn", "main:app", "--port", "8000", "--host", "0.0.0.0" ]
```

## requirements.txt

J'utilise Poetry pour gérer les dépendances et surtout pour générer le fichier de requirements


```toml:pyproject.toml
[tool.poetry]
name = "capture"
version = "0.1.0"
description = ""
authors = ["Benoit Deveaux <contact.flapili@gmail.com>"]

[tool.poetry.dependencies]
python = "^3.10"
fastapi = "^0.89.1"
uvicorn = "^0.20.0"
Pillow = "^9.4.0"
playwright = "^1.30.0"

[tool.poetry.dev-dependencies]
black = "^22.12.0"
flake8 = "^6.0.0"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

```shell
poetry export -f requirements.txt -o requirements.txt --without-hashes
```

ce qui donne le fichier suivant :

```text:capture/requirements.txt
anyio==3.6.2; python_full_version >= "3.6.2" and python_version >= "3.7"
click==8.1.3; python_version >= "3.7"
colorama==0.4.6; python_version >= "3.7" and python_full_version < "3.0.0" and platform_system == "Windows" or platform_system == "Windows" and python_version >= "3.7" and python_full_version >= "3.7.0"
fastapi==0.89.1; python_version >= "3.7"
greenlet==2.0.1; python_version >= "3.7" and python_full_version < "3.0.0" or python_full_version >= "3.5.0" and python_version >= "3.7"
h11==0.14.0; python_version >= "3.7"
idna==3.4; python_full_version >= "3.6.2" and python_version >= "3.7"
pillow==9.4.0; python_version >= "3.7"
playwright==1.30.0; python_version >= "3.7"
pydantic==1.10.4; python_version >= "3.7"
pyee==9.0.4; python_version >= "3.7"
sniffio==1.3.0; python_full_version >= "3.6.2" and python_version >= "3.7"
starlette==0.22.0; python_version >= "3.7"
typing-extensions==4.4.0; python_version >= "3.7"
uvicorn==0.20.0; python_version >= "3.7"
```

## le service de capture, main.py

```python:capture/main.py
# coding: utf-8
import io
from typing import Union

from PIL import Image
from playwright.async_api import async_playwright
from fastapi import FastAPI, Response, Header, HTTPException

app = FastAPI(openapi_url=None)

# /{path:path} est un catch-all
@app.get("/{path:path}")
async def get_capture(
    path: str,
    host: Union[str, None] = Header(default=None, alias="x-forwarded-host"),
):
    # si c'est pas apellé depuis un domain personalisé
    # (qui est transmis à l'application via le header x-forwarded-host)
    if host is None:
        raise HTTPException(status_code=400, detail="bad host")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1920, "height": 1080})
        await page.goto(f"https://{host}")

        # on enlève les scrollbar
        await page.evaluate("document.documentElement.style.overflow = 'hidden';")

        result = await page.screenshot()

        await page.close()
        await browser.close()

        # on redimensionne l'image
        with io.BytesIO(result) as f:
            with Image.open(f) as img:
                resized_img = img.convert("RGB").resize((960, 540))

        # on transforme tout ça en jpeg avec une qualité de 80%
        with io.BytesIO() as output_img:
            resized_img.save(output_img, "JPEG", quality=80)

            # on retourne l'image
            # de plus on utilise le header cache-control pour dire au CDN de google
            # de garder en cache l'image pendant 600s
            return Response(
                content=output_img.getvalue(),
                media_type="image/jpeg",
                headers={"Cache-Control": "public, max-age=0, s-maxage=600"},
            )
```

# Deployement du container

<ContentWarningbox>
  Prérequis: il faut avoir installé gcloud.
</ContentWarningbox>


```shell
# Login sur la cli de GCP
gcloud auth login

# On selectionne le bon projet
gcloud config set project test-nuxt3-faas

# ça va demander quelques infos, comme le nom du service, la region, etc
gcloud run deploy
```

Et normalement le service Cloud Run est déployé

# Utilisation du service

Je me suis fait un composable pour avoir le host coté Nuxt:

```ts:composables/useHost.ts
export const useHost = () => {
  const headers = useState('headers', () => useRequestHeaders()).value
  const host = headers['x-forwarded-host']
  return host
}
```

et dans le app.vue il suffit de rajouter les metas openGraph, de dire que l'image est sur l'url `{host}/_api/capture`

```html:app.vue
<script setup>
const host = useHost()
useSeoMeta({
  ogImage: () => `https://${host}/_api/capture`,
  ogImageHeight: 540,
  ogImageWidth: 960,
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

Il n'y a plus qu'à faire une règle de redirection

```json:firebase.json
{
  "functions": {
    "source": ".output/server"
  },
  "hosting": [
    {
      "site": "test-nuxt3-faas",
      "public": ".output/public",
      "cleanUrls": true,
      "rewrites": [
        {
          "source": "/_api/capture",
          "run": {
            "serviceId": "capture",
            "region": "europe-west1"
          }
        },
        {
          "source": "**",
          "function": "server"
        }
      ]
    }
  ]
}
```
Un coup de `firebase deploy` and voilà !

si je vais sur `https://test-nuxt3-faas.flapili.fr/_api/capture` j'ai ça comme rendu :
<ContentImage src="/posts/nuxt3-capture/capture.jpeg" alt="capture" />

Et si je partage le lien sur discord TADAAAA !


<ContentImage src="/posts/nuxt3-capture/previsu-discord.jpeg" alt="previsu-discord" />
