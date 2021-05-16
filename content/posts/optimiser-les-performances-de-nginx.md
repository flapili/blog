---
title: Augmenter les performances de Nginx
description: 
author:
    name: flapili
    avatar: flapili.webp
archived: false
image:
    src: NGINX-logo.png
    alt: logo de Nginx
tags: nginx;performances;optimisations
createdAt: "2021-05-15T18:42:13.509Z"
---



## Préambule
- Ce tutoriel s'adresse aux gens sous GNU/Linux, il a été fait sous Debian 10 (avec un compte root).
- Il est possible que certaines commandes changent suivant votre distribution (et surtout de votre packet manager) ou qu'il y ai besoin d'utiliser sudo.

## Installation des prérequis

<client-only>
    <div style="display: flex;justify-content:center;">
        <div class="termy">
            // installation des paquets prérequis ...
            $ apt update && apt install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common
            ---> 100%
    </div>
</div>
</client-only>


## Installation de Nginx
On va ici utiliser directement les repositories de Nginx plutôt que ceux de Debian:

<client-only>
    <div style="display: flex;justify-content:center;">
        <div class="termy">
            // On va dans /tmp pour ne pas polluer notre ~home
            $ cd /tmp
            // On télécharge la clef
            $ wget https://nginx.org/keys/nginx_signing.key
            ---> 100%
            // On ajoute la clef précedement téléchargée
            $ apt-key add nginx_signing.key
            OK
            // On ajoute le repository de Nginx dans nos sources
            nano /etc/apt/sources.list.d/nginx.list
        </div>
    </div>
</client-only>

à ajouter dans `/etc/apt/sources.list.d/nginx.list`
```
deb http://nginx.org/packages/mainline/debian buster nginx
deb-src https://nginx.org/packages/mainline/debian/ buster nginx
```

<client-only>
    <div style="display: flex;justify-content:center;">
        <div class="termy">
            $ apt update && apt install nginx
            ---> 100%
        </div>
    </div>
</client-only>

## Tuning de la configuration
Le point d'entrée de la configuration de Nginx est `/etc/nginx/nginx.conf`.<br>


## block racine

### worker_processes
Par défaut cette directive est à 1, celà veux dire qu'il n'y a qu'un seul processus Nginx qui tourne, or de nos jours il est fréquent d'avoir des serveurs avec plus d'un core CPU.<br>
Malheureusement un processus Nginx n'est pas capable d'utiliser plus d'un core à la fois ...<br>
Heureusement il est possible de faire tourner plusieurs processus de Nginx, en plus c'est super simple avec la directive `worker_processes`.

Le plus simple est de définir `worker_processes` à `auto`, cela va créer autant de processus Nginx qu'il y a de core.

**Mais attends ?!**<br>
Comment c'est possible que plusieurs processus écoutent sur le même port ?

1. Nginx se lance une 1ère fois en root (bien obligé pour écouter sur les ports inférieurs à 1024 sans utiliser CAP_NET_BIND_SERVICE) et bind les sockets (écoute sur le port 80 par exemple pour faire simple), on l'appelle `master`.
2. Puis il se dédouble en autant d'exemplaire que défini par la directive `worker_processes`, se sont des `workers`.
3. Les `workers` changent d'utilisateur conformément à la directive `user`.

L'astuce réside dans le fork (le dédoublage), le processus père partage toutes les ressources qu'il a à son nouveau fils, y compris fichiers et ports ouverts.<br>
*en réalité fichier et ports sont la même chose sous Unix, se sont des files descriptor ... mais ça c'est un autre sujet.*
<div style="text-align: center;">
    <img
        src="/posts/nginx-master-workers.png"
        alt="Illustration nginx master / workers"
        loading="lazy"
        style="max-width: 100%;min-width: 50%;border-radius:10px;border: solid 1px black"
    >
</div>


## block events

### multi_accept
si `multi_accept` est à `on` un processus worker va accepter toutes les nouvelles connexions en même temps, au contraire si si la directive est à `off` il ne pourra en accepter qu'une à la fois.<br />
*Par défaut cette directive est sur `off`.*

### worker_connections
règle le nombre maximal de connexions simultanées qu'un worker peut ouvrir en même temps.<br />
Il faut garder à l'esprit que ça inclue toutes les connexions (connexion avec un backend proxié par exemple).

On peut augmenter ce paramètre à 1024 sans trop de soucis.<br />
*Par défaut ce paramètre est à `512` requêtes simultanées par workers.*

## block http

### sendfile
Utilise l'appel kernel [sendfile](http://manpages.ubuntu.com/manpages/trusty/man2/sendfile.2freebsd.html) dans le cas où nginx doit servir des fichiers statiques, plutôt qu'une combinaison de write et read.
*Par défaut ce paramètre est à `off`.*

### aio
Permet de ne pas bloquer la boucle d'événement du processus worker dans le cas où une opération bloquante est en cours (lecture de fichier par exemple)<br />
*Par défaut cette directive est à `off`.*

### tcp_nopush
Permet d'envoyer les entêtes HTTP et le début (ou la totalité) du fichier en un seul packet.<br>
*Par défaut cette directive est à `off`.*

### gzip
Permet de compresser la réponse renvoyée par Nginx.
*Par défaut cette directive est à `off`.*

### gzip_proxied
Permet de compresser les réponses pour des requêtes proxiées suivant les entêtes HTTP<br />
Je conseille d'utiliser `any` pour tout le temps activer la compression.
*Par défaut cette directive est à `off`.*

### gzip_comp_level
Permet de plus ou moins compresser la réponse, une valeur élevée entrainera une consommation CPU plus importante<br/>
Le juste milieu entre usage CPU et usage réseau se situe au alentour de `5`/`6`.<br />
*Par défaut le niveau est à `1`.*


## Mise en cache

<infobox>
    Ce cache ne s'applique que dans le cadre de ressources proxiées.
</infobox>

<warningbox card-style="margin-top:10px;">
    Mettre en cache des données venant de votre API peux avoir des effets indésirables.
</warningbox>

dans `etc/nginx/nginx.conf`
```nginx
proxy_cache_path /tmp/cache levels=1:2 keys_zone=my_cache:10m inactive=10m;
```
Cette directive permet de créer une zone de cache nommée `my_cache` qui a un index de 10mb (ce qui doit être suffisant pour le commun des mortels)<br />
`/tmp/cache` défini où le cache sera écrit sur le disque, dans le cas de forte activité le kernel Linux devrait être assez malin pour mettre les fichiers dans un cache LRU, pas besoin donc d'un montage de type tmpfs<br />
`inactive` permet de stipuler au bout de combien de temps les fichiers de cache devraient être purger si le cache n'est pas utilisé.

dans `/etc/nginx/sites-enabled/monsite.fr.conf`
```nginx
proxy_cache my_cache;
proxy_cache_methods GET HEAD;
proxy_cache_valid 200 302 10s;
add_header X-Cache-Status $upstream_cache_status;
```
- `proxy_cache` permet de dire qu'on va utiliser le cache nommé `my_cache`, défini dans le block http juste au dessus.
- `proxy_cache_methods` permet de dire sur quelles methodes on va mettre en place le cache. *par défaut se sont les méthodes GET et HEAD qui sont misent en cache.*
- `proxy_cache_valid` permet de définir quels status code seront mis en cache et pour combien de temps. Par example `proxy_cache_valid 200 302 10s;` met en cache toutes les réponses 200 et 302 de l'api proxiée avec une durée de validité de 10 secondes.
- `add_header` n'est pas une directive propre à la mise en cache, cependant la variable `upstream_cache_status` indique si la requête a été ou non tirée du cache, cela nous permet donc de savoir si les données viennent de l'api ou du cache.

## ratelimit

dans `etc/nginx/nginx.conf` on va définir tout comme pour le cache une zone de ratelimit
```nginx
limit_req_zone $binary_remote_addr zone=1reqPer1Second:10m rate=1r/s;
```
On crée donc une zone qui s'appelle `1reqPer1Second` avec comme clef de dictionnaire `$binary_remote_addr` et comme taille maximale du dictionnaire 10mb.<br />

dans `/etc/nginx/sites-enabled/monsite.fr.conf`
```nginx
limit_req zone=1reqPer1Second burst=50 nodelay;
limit_req_status 429;
```
- `limit_req zone=1reqPer1Second burst=50 nodelay;` permet de dire qu'on va utiliser la zone précédement créée, pour `burst` il va falloir utiliser l'analogie du [seau percé](https://fr.wikipedia.org/wiki/Seau_percé)<br />
    - On prends un seau qui peut contenir 50 unitées (des requêtes ici)
    - toutes les secondes une unité s'écoule du seau
    - quand le seau arrive à 50 il déborde, la requête n'est pas traitée
- `limit_req_status` défini le status de la réponse renvoyé par Nginx dans le cas d'un ratelimit

## Bonus: redirection en HTTPS sur tous vos vhosts

On va rediriger toutes les requêtes qui sont sur le port 80 (http) vers le port 443 (https)<br>
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;
    return 301 https://$host$request_uri;
}
```
<infobox>
    Il est possible de modifier ce comportement pour un vhost en mettant le bon `server_name`.
</infobox>


## Récapitulation
`/etc/nginx/nginx.conf`
```nginx

user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
	multi_accept on;
	worker_connections  1024;
}

http {
	limit_req_zone $binary_remote_addr zone=1reqPer1Second:10m rate=1r/s;
	proxy_cache_path /tmp/cache levels=1:2 keys_zone=my_cache:10m inactive=10m;
	##
	# Basic Settings
	##

	sendfile on;
	aio on;
	tcp_nopush on;
	types_hash_max_size 2048;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	##
	# SSL Settings
	##

	# ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
	ssl_protocols TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	##
	# Logging Settings
	##

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# Gzip Settings
	##

	gzip on;
	gzip_proxied any;
	gzip_comp_level 6;
	gzip_http_version 1.1;
	gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

	##
	# Virtual Host Configs
	##
	server {
		listen 80;
		listen [::]:80;
		server_name _;
		return 301 https://$host$request_uri;
	}
	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*.conf;
}
```

`/etc/nginx/sites-enabled/monsite.fr.conf`
```nginx

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name monsite.fr www.monsite.fr;

    location / {

        limit_req zone=1reqPer1Second burst=50 nodelay;
        limit_req_status 429;

        proxy_cache my_cache;
        proxy_cache_methods GET HEAD;
        proxy_cache_valid 200 302 10s;
        add_header X-Cache-Status $upstream_cache_status;
        proxy_pass http://unix:/tmp/monsite.fr.sock;
        include /etc/nginx/proxy_params;
    }
    ssl_certificate /etc/letsencrypt/live/flapili.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/flapili.fr/privkey.pem;
}
```
