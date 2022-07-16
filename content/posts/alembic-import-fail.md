---
title: Comment résoudre les problèmes d'import avec l'option autogenerate d'Alembic ?
description: Arretez de vous prendre la tête avec les imports qui ne marchent jamais, Alembic est un outil de migration de schéma de base de donnée SQL (MySQL, PostgreSQL, SQLite, ect ...) en ligne de commande.
author:
  name: flapili
  avatar: flapili.webp
archived: false
tags:
 - Python
 - Alembic
 - Migration SQL
createdAt: "2020-10-07T11:52:59.000Z"
---

## Qu'est ce qu'Alembic ?

[Alembic](https://alembic.sqlalchemy.org/en/latest/) est un outil de migration de schéma de base de donnée SQL (MySQL, PostgreSQL, SQLite, ect ...) en ligne de commande.
Il permet à partir d'un code comme celui là

```py
# coding: utf-8
import sqlalchemy
from sqlalchemy.sql import func

from ..metadata import metadata


user = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True, index=True,),
    sqlalchemy.Column(
        "username",
        sqlalchemy.String(length=64),
        index=True,
        nullable=False,
        unique=True,
    ),
    sqlalchemy.Column(
        "hashed_password", sqlalchemy.String(length=128), nullable=False,
    ),
    sqlalchemy.Column(
        "email", sqlalchemy.String(length=255), index=True, nullable=False, unique=True,
    ),
    sqlalchemy.Column(
        "created_at", sqlalchemy.DateTime, nullable=False, server_default=func.now(),
    ),
    sqlalchemy.Column(
        "updated_at",
        sqlalchemy.DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    ),
)
```

pour générer la table user avec tout ce qui va bien.


## Un peu de contexte :

Soit une structure de projet classique:
```
projet <- vous êtes ici
│   alembic.ini
│   requirements.txt
│
├───core
│       app.py
│       setting.py
│       __init__.py
│
└───db
    │   metadata.py
    │   __init__.py
    │
    ├───migrations
    │   │   env.py
    │   │   README
    │   │   script.py.mako
    │   │   __init__.py
    │   │
    │   └───versions
    └───models
            user.py
            __init__.py
```

On lance `alembic revision --autogenerate -m "ajout de la table user"` depuis le répertoire projet et ça vous pète une ModuleNotFoundError ... sympathique non ? **NON**


## Comment marchent les imports dans Python ?

Lors d'un `import` Python va regarder si le module n'est pas déjà présent dans le dictionnaire [sys.modules](https://docs.python.org/fr/3/library/sys.html#sys.modules) qui sert de cache.
S'il n'est pas trouvé il va essayer de le trouver à l'aide du [chercheur](https://docs.python.org/fr/3/glossary.html#term-finder) et pour ça il va se baser sur les différents chemins de [sys.path](https://docs.python.org/fr/3/library/sys.html).

voici un exemple de mon sys.path
```py
>>> from pprint import pprint
>>> import sys
>>> pprint(sys.path)
['',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\Lib\\idlelib',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\python38.zip',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\DLLs',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38',
 'C:\\Users\\DEVEAUX\\AppData\\Roaming\\Python\\Python38\\site-packages',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib\\site-packages',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib\\site-packages\\win32',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib\\site-packages\\win32\\lib',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib\\site-packages\\Pythonwin']
 ```
ça veux dire que si j'essaye de faire
```py
import foo
```
Python va en 1er regarder dans `'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\Lib\\idlelib'` regarder s'il ne trouve pas un dossier nommé "foo" ou un fichier nommé "foo.py", puis va regarder dans `'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\python38.zip'` (là me demandez pas ce que fou un zip dans sys.path), ect ...


Maintenant créons un fichier `print_syspath.py` quelque part et lancons le:

```py
import sys
from pprint import pprint

pprint(sys.path)
```


on obtient
```py
[
 'C:\\Users\\DEVEAUX\\Desktop\\demo alembic',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\python38.zip',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\DLLs',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38',
 'C:\\Users\\DEVEAUX\\AppData\\Roaming\\Python\\Python38\\site-packages',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib\\site-packages',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib\\site-packages\\win32',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib\\site-packages\\win32\\lib',
 'C:\\Users\\DEVEAUX\\AppData\\Local\\Programs\\Python\\Python38\\lib\\site-packages\\Pythonwin'
]
 ```

Regardez, la 1ère ligne est importante, ça veux dire que Python ajoute automatiquement le dossier dans lequel le script s'execute au path.

## Pourquoi est ce que alembic se plante comme une merde ?

Il n'ajoute tout simplement pas le dossier au sys.path quand vous tapez la commande `alembic revision --autogenerate -m "message"`.

## Solution

dans le fichier env.py il suffit de rajouter quelques lignes :

```py
import sys  # on ajoute cette ligne là
from pathlib import Path  # on ajoute également cette ligne là
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

sys.path.append(str(Path.cwd()))  # et enfin on ajoute le cwd au path
```

Voilà comment régler un problème qui peut durer des heures en quelques lignes ... c'est con quand même un ordinateur nan ?
