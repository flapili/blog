---
title: Automatisez vos workflows avec Prefect
description: Prefect est la tour de contrôle pour les stack de données modernes, surveillez, coordonnez et orchestrez les flux de données entre et à travers vos applications. Créez des pipelines, déployez-les n'importe où et configurez-les à distance.
author:
  name: flapili
  avatar: flapili.webp
archived: false
tags:
 - Tasks
 - Flows
 - Orchestration
createdAt: "2022-09-24T06:29:14.841Z"
---
 {{ $doc.toc}}

Bonjour !

Aujourd'hui un petit article pour présenter [Prefect](https://docs.prefect.io/) 😉

PS: N'hésitez pas à donner votre avis sur le [discord](https://discord.flapili.fr), si vous voyez une coquille n'hésitez pas à la remonter 😋

# Présentation

## Qu'est ce que Prefect ?
D'après la [page de présentation](https://docs.prefect.io/) :
>Prefect is air traffic control for the modern data stack. Monitor, coordinate, and orchestrate dataflows between and across your applications. Build pipelines, deploy them anywhere, and configure them remotely.

En gros Prefect est la tour de contrôle pour les stack de données modernes, surveillez, coordonnez et orchestrez les flux de données entre et à travers vos applications. Créez des pipelines, déployez-les n'importe où et configurez-les à distance.

En gros ça va vous permettre de lancer via GUI, API ou CRON des ensembles de taches, par exemple deployer un site puis envoyer un mail.

# Mise en pratique

## Préambule
Chez moi j'ai un serveur tournant sous Proxmox qui me permet de créer des VM, plutôt que de faire une démonstration sur du cloud (AWS, GCP, OVH, etc ...) je ferais une démonstration sur mon lab, je ne traiterais pas de la partie sécurité pour la mise en production.

## Création des VMs
Je vais créer 3 machines, une qui sera le contrôleur et deux qui seront les workers.<br>
Les 3 machines seront sous ubuntu 22.04LTS parce que j'ai la flemme de faire d'autres templates 😅<br>
2 Go de ram et 2 cores seront largement suffisant

![Diagramme](/posts/prefect/diagramme-infra.jpg){legend="Diagramme de l'infrastructure"}

![Création des VMs](/posts/prefect/creation-vm.png){legend="Création des VMs"}

On attends que CloudImage setup les VMs, on mets tous ça sous DHCP en faisant joujou avec dhclient:

| Nom         | IP          |
|-------------|-------------|
| controlleur | 10.0.10.200 |
| worker-1    | 10.0.10.201 |
| worker-2    | 10.0.10.202 |

## Installation de Prefect

::messageBox{type=info}
Pour la démo je ne vais pas m'embeter à compiler Python depuis les sources ni installer de [venv](https://docs.python.org/fr/3/library/venv.html), mais dans un environnement de production je l'aurai fait.
::

On se log avec `ssh root@10.0.10.200` pour commencer (grace à Cloud init j'ai déjà ma clé publique dans les authorized_keys).

Un petit coup d'`apt update && apt upgrade` ça fait pas de mal, même si normallement cloud-init le fait déjà, on reboot parce que y'a un nouveau kernel de dispo.

Et enfin, `pip install -U prefect smbprotocol` (smbprotocol sera pour un peu plus tard) sur toutes les VMs.

# Lancement d'Orion, le serveur de Prefect

Pour le lancer rien de plus simple: `prefect orion start --host 0.0.0.0`

::messageBox{type=info}
Ne suivez pas à la lettre le **--host 0.0.0.0**

C'est pour la démo que je fais ça, si vous n'avez pas de pare-feu tout le monde pourra utiliser votre Prefect, pas foufou !
::

On se rend sur http://10.0.10.200:4200 (le port par défaut d'Orion)

![Interface d'Orion](/posts/prefect/dashboard-vide.png){legend="Le dashboard de Prefect"}

Bon, pas grand chose encore, on va créer notre 1er deployment :

## Création du 1er deployment

On crée un fichier python dans `/root` parce que yolo !

```python [/root/demo_prefect.py]
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
```bash [sortie]
Found flow 'Hello Flow'
Default '.prefectignore' file written to /root/.prefectignore
Deployment YAML created at '/root/hello_world-deployment.yaml'.
Deployment storage None does not have upload capabilities; no files uploaded.  Pass --skip-upload to suppress this warning.
```

On retourne sur le dashboard et ... toujours rien, pour le moment on a juste créé un fichier .yaml 😁, regardons le contenu :

```yaml [hello_world-deployment.yaml]
# ##
# ## A complete description of a Prefect Deployment for flow 'Hello Flow'
# ##
name: démo
description: null
version: 9f322938015631280a9869b82a116af5
# The work queue that will handle this deployment's runs
work_queue_name: queue_de_démo
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

# ##
# ## DO NOT EDIT BELOW THIS LINE
# ##
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

![Interface d'Orion](/posts/prefect/dashboard.png){legend="Dashboard de Prefect"}

maintenant on va lancer le deployment

![Interface d'Orion](/posts/prefect/run-deploy.png){legend="Lancement d'un deployment"}

![Interface d'Orion](/posts/prefect/flow-run.png){legend="Le flowrun créé par le lancement du deployment"}

Et ... Et ... Bah rien ... Le code est pas éxécuté 😅 ...

# Lancement de l'agent

On se connecte sur le worker-1, on met le script `demo_prefect.py` créé plus tôt dans `/root` (pour que ça corresponde au fichier de deployment)

Puis on lance l'agent de prefect :
```bash
PREFECT_API_URL="http://10.0.10.200:4200/api" prefect agent start -q queue_de_démo
Starting v2.4.0 agent connected to http://10.0.10.200:4200/api...

  ___ ___ ___ ___ ___ ___ _____     _   ___ ___ _  _ _____
 | _ \ _ \ __| __| __/ __|_   _|   /_\ / __| __| \| |_   _|
 |  _/   / _|| _|| _| (__  | |    / _ \ (_ | _|| .` | | |
 |_| |_|_\___|_| |___\___| |_|   /_/ \_\___|___|_|\_| |_|

Agent started! Looking for work from queue(s): queue_de_démo...
08:26:07.261 | INFO    | prefect.agent - Submitting flow run '3bca7018-1024-4b65-b7fd-3c97ee737097'
08:26:07.346 | INFO    | prefect.infrastructure.process - Opening process 'jumping-asp'...
08:26:07.348 | INFO    | prefect.agent - Completed submission of flow run '3bca7018-1024-4b65-b7fd-3c97ee737097'
08:26:09.541 | INFO    | Flow run 'jumping-asp' - Created task run 'print_hello-b6d49d4c-0' for task 'print_hello'
08:26:09.543 | INFO    | Flow run 'jumping-asp' - Executing 'print_hello-b6d49d4c-0' immediately...
08:26:09.614 | INFO    | Task run 'print_hello-b6d49d4c-0' - Finished in state Completed()
08:26:09.645 | INFO    | Flow run 'jumping-asp' - Finished in state Completed('All states completed.')
Hello world!
08:26:10.048 | INFO    | prefect.infrastructure.process - Process 'jumping-asp' exited cleanly.
```

And voilà 😉

![interface d'Orion](/posts/prefect/dashboard-run.png)
![interface d'Orion](/posts/prefect/dashboard-run2.png)

## Bonus, deployment dans le cloud

Bon, on va pas se mentir devoir upload les fichiers pythons à la main c'est relou, heureusement prefect a des solutions

![Le Cloud](/posts/prefect/le-cloud.jpeg)

Bon comme je suis sur une infra de test je vais utiliser du SMB, mais en pratique on va utiliser les services managés des cloud providers.

### Configuration du serveur SMB

On install `samba` sur le contrôleur (`apt install samba`)<br>
On crée un dossier share-prefect dans /var/smb : `mkdir -p /var/smb/share-prefect`<br>
On configure samba:
```bash [/etc/samba/smb.conf]
[share_prefect]
    path = /var/smb/share-prefect
    read only = no
    browsable = yes
```

On relance le service: `systemctl reload smbd`<br>
Enfin on rajoute l'utilisateur root (avec le mot de passe "root")

```bash
smbpasswd -a root
New SMB password:
Retype new SMB password:
Added user root.
```

### Ajout du bloc dans Prefect

On ajoute un bloc de type SMB tel quel

![interface d'Orion](/posts/prefect/dashboard-ajout-block-smb.png)

On supprime le deployment précédant depuis l'interface, ainsi que la queue et le flow

Puis on crée un deployment:
`prefect deployment build demo_prefect.py:hello_world --name démo_smb -q queue_de_démo -sb smb/test`
```bash
Found flow 'Hello Flow'
Deployment YAML created at '/root/hello_world-deployment.yaml'.
Successfully uploaded 8 files to smb://10.0.10.200/share_prefect/var/smb/share-prefect/
```
Le flag `-sb` indique qu'on veux deployer en utilisant le storage block de type `smb` qui porte le nom `test`

La tronche du fichier nouvellement créé:
```yaml [hello_world-deployment.yaml]
# ##
# ## A complete description of a Prefect Deployment for flow 'Hello Flow'
# ##
name: démo_smb
description: null
version: 9f322938015631280a9869b82a116af5
# The work queue that will handle this deployment's runs
work_queue_name: queue_de_démo
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

# ##
# ## DO NOT EDIT BELOW THIS LINE
# ##
flow_name: Hello Flow
manifest_path: null
storage:
  share_path: share_prefect/var/smb/share-prefect
  smb_username: '**********'
  smb_password: '**********'
  smb_host: 10.0.10.200
  smb_port: null
  _block_document_id: 38202b86-7f90-46d8-a4c7-8ebec3c42181
  _block_document_name: test
  _is_anonymous: false
  block_type_slug: smb
  _block_type_slug: smb
path: ''
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

On applique le deployment fraichement créé: `prefect deployment apply hello_world-deployment.yaml` (on est toujours sur le contrôleur)<br>

Maintenant sur le worker-1 on va supprimer le fichier `demo_prefect.py` et run le nouveau deployment depuis l'interface web (pour rappel http://10.0.10.200:4200 dans mon cas), et là comme par magie l'agent Prefect va chercher sur le partage SMB les fichiers nécessaires au run.

## Bonus, dotenv

Bon, devoir faire `PREFECT_API_URL="http://10.0.10.200:4200/api" prefect agent start -q queue_de_démo` c'est un peu relou, et en plus ça reste dans l'historique, heureusement le package **python-dotenv** permet de lancer un process en prennant en compte un fichier .env :

### Fichier .env
on va donc faire un fichier .env :

```bash [.env]
PREFECT_API_URL="http://10.0.10.200:4200/api"
```

### Installation de python-dotenv

::messageBox{type=warning}
Encore une fois dans un environnement de production il serait preferable d'utiliser un [venv](https://docs.python.org/fr/3/library/venv.html), ou encore mieux [Poetry](https://python-poetry.org/).
::

`pip install python-dotenv`
```bash
Collecting python-dotenv
  Downloading python_dotenv-0.21.0-py3-none-any.whl (18 kB)
Installing collected packages: python-dotenv
Successfully installed python-dotenv-0.21.0
```

### Utilisation de python-dotenv

il suffit de lancer `dotenv run prefect agent start -q queue_de_démo` dans le repetoire où il y a le .env and voila.

Bon, en vrai on dira au process manager (systemd, PM2, supervisor, docker, etc ...) d'utiliser le .env sans avoir à utiliser `dotenv run`.<br>
Par exemple avec un service systemd:

```bash [/etc/systemd/system/prefect-agent.service]
[Unit]
Description = mon agent prefect
After = network.target

[Service]
EnvironmentFile=/path/du/dossier/avec/le/dotenv/.env
ExecStart = /usr/local/bin/prefect agent start -q queue_de_démo

[Install]
WantedBy = multi-user.target
```
