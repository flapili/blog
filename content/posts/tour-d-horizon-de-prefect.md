---
title: Tour d'horizon de Prefect
description: TODO
author:
  name: flapili
  avatar: flapili.webp
archived: false
tags:
 - Tasks
 - Flows
 - Orchestration
createdAt: "2022-09-16T05:50:24.418Z"
---
[[toc]]

Bonjour !

Aujourd'hui un petit article pour présenter [Prefect](https://docs.prefect.io/) 😉<br/>

# Présentation

## Qu'est ce que Prefect ?
d'après la page de présentation :
>Prefect is air traffic control for the modern data stack. Monitor, coordinate, and orchestrate dataflows between and across your applications. Build pipelines, deploy them anywhere, and configure them remotely.

En gros Prefect est la tour de contrôle pour les stack de données modernes, Surveillez, coordonnez et orchestrez les flux de données entre et à travers vos applications. Créez des pipelines, déployez-les n'importe où et configurez-les à distance.

# Mise en pratique

## Préambule
Chez moi j'ai un serveur tournant sous Proxmox qui me permet de créer des VM, plutôt que de faire une démonstration sur du cloud (AWS, GCP, OVH, etc ...)je ferais une démonstration sur mon lab, je ne traiterais pas de la partie sécurité pour la mise en production.


## Création des VMs
Je vais créer 3 machines, une qui sera le controlleur et deux qui seront les workers.<br>
Les 3 machines seront sous ubuntu 22.04LTS parce que j'ai la flemme de faire d'autres templates 😅<br>
2 Go de ram et 2 cores seront largement suffisant

<ContentImage src="/posts/prefect/creation-vm.png" alt="Création des VMs" />

On attends que CloudImage setup les VMs, on mets tous ça sous DHCP en faisant joujou avec dhclient:

VM controlleur: 10.0.10.200<br>
VM worker-1: 10.0.10.201<br>
VM worker-2: 10.0.10.202<br>

## Installation de Prefect
Ici on ne va pas s'embeter à installer une nouvelle version de Python depuis les sources pour la démo ni utiliser Poetry mais en vrai faites le !

On se log avec `ssh root@10.0.10.200` pour commencer (grace à Cloud init j'ai déjà ma clé publique dans les authorized_keys), bon en vrai je vais utiliser Vscode pour me log 😆.

Un petit coup d'`apt update && apt upgrade` ça fait pas de mal, même si normallement cloud-init le fait déjà, on reboot parce que y'a un nouveau kernel de dispo.

Et enfin, `pip install -U prefect smbprotocol` (smbprotocol sera pour un peu plus tard) sur toutes les VMs.

# Lancement d'Orion, le serveur de Prefect

Pour le lancer rien de plus simple: `prefect orion start --host 0.0.0.0`
<ContentWarningbox>
    Ne suivez pas à la lettre le --host 0.0.0.0<br>
    C'est pour la démo que je fais ça, si vous n'avez pas de parfeu tout le monde pourra utiliser votre Prefect, pas foufou !
</ContentWarningbox>

On se rend sur http://10.0.10.200:4200 (le port par défaut d'orion)
<ContentImage src="/posts/prefect/dashboard-vide.png" alt="interface d'orion" />

Bon, pas grand chose encore, on va créer notre 1er deployment :

## Création du 1er deployment

On crée un fichier python dans `/root` parce que yolo !

```py:/root/demo_prefect.py
from prefect import flow, task

@task
def print_hello(name):
    print(f"Hello {name}!")

@flow(name="Hello Flow")
def hello_world(name="world"):
    print_hello(name)
```

On build un deployment assez simplement
`prefect deployment build demo_prefect.py:hello_world --name démo -q queue_de_démo`
```sh:sortie
Found flow 'Hello Flow'
Default '.prefectignore' file written to /root/.prefectignore
Deployment YAML created at '/root/hello_world-deployment.yaml'.
Deployment storage None does not have upload capabilities; no files uploaded.  Pass --skip-upload to suppress this warning.
```

On retourne sur le dashboard et ... toujours rien, pour le moment on a juste créé un fichier .yaml, regardons le contenu

```yaml:hello_world-deployment.yaml
###
### A complete description of a Prefect Deployment for flow 'Hello Flow'
###
name: "d\xE9mo"
description: null
version: 9f322938015631280a9869b82a116af5
# The work queue that will handle this deployment's runs
work_queue_name: "queue_de_d\xE9mo"
tags: []
parameters: {}
schedule: null
infra_overrides: {}
infrastructure:
  type: process
  env: {}
  labels: {}
  name: null
  command: null
  stream_output: true
  block_type_slug: process
  _block_type_slug: process

###
### DO NOT EDIT BELOW THIS LINE
###
flow_name: Hello Flow
manifest_path: null
storage: null
path: /root
entrypoint: demo_prefect.py:hello_world
parameter_openapi_schema:
  title: Parameters
  type: object
  properties:
    name:
      title: name
      default: world
  required: null
  definitions: null
```

Et on a plus qu'à l'appliquer : `prefect deployment apply hello_world-deployment.yaml` et TADA !

<ContentImage src="/posts/prefect/dashboard.png" alt="interface d'orion" />

maintenant on va lancer le deployment

<ContentImage src="/posts/prefect/run-deploy.png" alt="interface d'orion" />
<ContentImage src="/posts/prefect/flow-run.png" alt="interface d'orion" />
et ... et ... bah rien, le code est pas éxécuté
