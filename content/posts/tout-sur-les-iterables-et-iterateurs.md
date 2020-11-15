---
title: Tout sur les itérables et les itérateurs
description: Tout ce que vous Vous avez toujours voulu savoir sur les itérables et les itérateurs, en passant par la fonction next et iter.
author:
    name: flapili
    avatar: flapili.webp
archived: false
image:
    src: ouroboros.png
    alt: serpent qui se mort la queue
tags: python;iter;collections;boucle
---

## Itérable

Un itérable est une [collection](https://en.wikipedia.org/wiki/Collection_(abstract_data_type)) dont on peut prendre les éléments un par un, concrétement en Python c'est un objet sur lequel on peut appliquer une boucle for.<br>
Voici les itérables qu'on rencontre le plus souvent :

### Liste et tuple

Une liste est l'objet le plus simple à appréhender avec la boucle for.
```py
for x in [1, 2, 3]:
    print(x)
# 1
# 2
# 3
```

Un tuple (ou n-uplet en français) est un objet similaire à une liste à la seule différence qu'il ne peux être modifié une fois créé.
```py
for x in (1, 2, 3):
    print(x)
# 1
# 2
# 3
```


### Chaîne de caractères

Une chaîne de caractères est également itérable.
```py
for c in "Python":
    print(c)
# P
# y
# t
# h
# o
# n
```


### range

```py
for n in range(4):
    print(n)
# 0
# 1
# 2
# 3
```


### Dictionnaire

Et oui, mêmes les dictionnaires sont itérables.
```py
for k in {"x": 1, "y": 2}:
    print(k)
# y
# x
```

### Fichier

```py
for l in open("a.txt"):
    print(l, end="")

# 1ère ligne
# 2nd ligne
```
<infobox>
    On donne l'argument nommé <code>end=""</code> à print car le fichier contient lui même des retours à la ligne.
</infobox>


### Les générateurs
Un générateur est un objet dont les valeurs sont calculées au fur et à mesure et sur lequel on ne peux itérer qu'une seule fois.

avec une fonction génératrice :
```py
def g():
	counter = 0
	print("on renvoie counter")
	yield counter
	print("on incrémente counter")
	counter +=1
	yield counter
	print("on incrémente counter encore")
	counter +=1
	yield counter

	
generateur = g() # le code n'est pas exécuté à ce moment là
for x in generateur: # mais maintenant
    print(x)

# on renvoie counter
# 0
# on incrémente counter
# 1
# on incrémente counter encore
# 2

for x in generateur: # là rien ne se passe, on a consummé notre générateur
    print(x)
```
Avec une expression génératrice :
```py
g = (x for x in range(5))
print(list(g))
# [0, 1, 2, 3, 4]

print(list(g))
# [] encore une fois, le générateur a été consummé
```


## Itérateur

Un itérateur est une sorte de curseur qui avance dans une collection d'objet (rien à voir avec les antiquaires je vous rassure).<br>
Un itérateur est donc un itérable, mais il est itérable qu'une seule fois.<br>
Pour créer un itérateur il y a plusieurs façons:

### La fonction iter

La fonction [iter](https://docs.python.org/fr/3/library/functions.html#iter) permet de facilement créer un itérateur à partir d'un itérable
```py
i = iter([1, 2, 3])
for x in i:
	print(x)	
# 1
# 2
# 3
```

### La méthode \_\_next\_\_

On peut implémenter un itérateur avec la méthode \_\_iter\_\_ et \_\_next\_\_.<br>
Dès que l'on souhaite arrêter la boucle on lève une exception [StopIteration](https://docs.python.org/fr/3/library/exceptions.html#StopIteration). 

```py
class MonIterateur():

	def __init__(self, stop):
		self.current = 0
		self.stop = stop

	def __iter__(self):

		return self

	def __next__(self):
		self.current += 1

		if self.current > self.stop:
			raise StopIteration
		return self.current

for x in MonIterateur(5):
	print(x)	
# 1
# 2
# 3
# 4
# 5
```

#### Comment ça marche ?

Si on ajoute quelques print pour y voir plus clair

```py
class MonIterateur():

	def __init__(self, stop):
		print("on rentre dans la fonction __init__")
		self.current = 0
		self.stop = stop

	def __iter__(self):
		print("on rentre dans la fonction __iter__")
		return self

	def __next__(self):
		print("on rentre dans la fonction __next__")
		self.current += 1

		if self.current > self.stop:
			raise StopIteration
		return self.current

iterateur = MonIterateur(5)
# on rentre dans la fonction __init__

for x in iterateur:
	print(x)
# on rentre dans la fonction __iter__
# on rentre dans la fonction __next__
# 1
# on rentre dans la fonction __next__
# 2
# on rentre dans la fonction __next__
# 3
# on rentre dans la fonction __next__
# 4
# on rentre dans la fonction __next__
# 5
# on rentre dans la fonction __next__

for x in iterateur:
	print(x)
	
# on rentre dans la fonction __iter__
# on rentre dans la fonction __next__
```
En faite la boucle for demande d'abord un objet sur lequel itérer puis itère sur cet objet avec la méthode \_\_next\_\_

#### Pourquoi ?!

Dès fois on ne veux pas avoir à définir la méthode \_\_next\_\_ dans la classe sur laquel on va itérer. C'est donc pour ça qu'on découpe le fonctionnement en deux

## L'intérieur d'une boucle for

En interne la boucle for fait une boucle infinie et appelle next sur un itérateur jusqu'à ce qu'une exception StopIteration soit levée.
```py
for x in range(5):
	print(x)

# 0
# 1
# 2
# 3
# 4
```
La boucle si dessus peut se réécrire de la façon suivante :
```py
iterator = iter(range(5)) # on crée l'itérateur
try:
	while True: # on boucle à l'infini
		x = next(iterator)
		print(x)
except StopIteration: # jusqu'à ce que l'itérateur lève une exception "StopIteration"
	pass

# 0
# 1
# 2
# 3
# 4
```

## Que faire avec tout ça ?

Il existe plein de fonctions et méthodes de classe qui utilisent des itérables, voici les plus communes.

### La méthode str.join

Un exemple vaut mille mots :

```py
>>> " séparateur ".join("abc")
'a séparateur b séparateur c'
```
Et oui, on se souvient que les chaînes de caractères sont itérables.

<warningbox>
	L'itérable donné à <a href="https://docs.python.org/fr/3/library/stdtypes.html#str.join"><code>str.join</code></a> doit renvoyer des chaînes de caractères.
</warningbox>

```py
>>> " séparateur ".join(range(5))
Traceback (most recent call last):
  File "<pyshell#2>", line 1, in <module>
    " séparateur ".join(range(5))
TypeError: sequence item 0: expected str instance, int found
```
Mais en utilisant une expression génératrice :
```py
>>> " séparateur ".join(str(n) for n in range(5))
'0 séparateur 1 séparateur 2 séparateur 3 séparateur 4'
```

### La fonction sum

La fonction sum permet de faire (🥁 *roulement de tambours*) des sommes
```py
>>> sum(range(5), start=0)
10
>>> sum(range(5), start=1)
11
```

Mais pas que, tout objet supportant \_\_add\_\_ peut être utilisé:
```py
>>> sum([[1], [2], [3]], start=[])
[1, 2, 3]

# même effet que
>>> [] + [1] + [2] + [3]
[1, 2, 3]
```

<div style="text-align: center;">
  <a href="https://tenor.com/view/yawnface-gif-4425271">
    <img
      src="https://media1.tenor.com/images/6eaab0d39bd1afa7be8985eb7ac2d28b/tenor.gif"
      alt="whaaaat"
      loading="lazy"
	  target="_blank"
      style="max-width: 100%;min-width: 25%;border-radius:10px;border: solid 1px black"
    >
  </a>
</div>

### La fonction len

La fonction [len](https://docs.python.org/fr/3/library/functions.html#len) n'est plus à présenter
```py
>>> len("azerty")
6
>>> len([1, 2, 3, 4, 5, "a", "b"])
7
```
<warningbox>
	La fonction len ne marche pas partout.
</warningbox>

### itertools.cycle

boucle à l'infini en repartant du début quand l'itérable est parcouru en entier.
```py
>>> import itertools
>>> cycle = itertools.cycle("abcd")
>>> for _ in range(20):
	print(next(cycle), end="")

'abcdabcdabcdabcdabcd'
```

### itertools.repeat

repète à l'infini un élément, dans le cas où un second argument `n` est donné l'élément est répété `n` fois.

```py
>>> import itertools
>>> list(itertools.repeat(25, 4))
[25, 25, 25, 25]

>>> list(itertools.repeat(25))
[25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, ...]
```

### itertools.product

```py
>>> import itertools
>>> from pprint import pprint # pretty print
>>> pprint(list(itertools.product([1, 2, 3], [4, 5, 6], [7, 8, 9])))
[(1, 4, 7),
 (1, 4, 8),
 (1, 4, 9),
 (1, 5, 7),
 (1, 5, 8),
 (1, 5, 9),
 (1, 6, 7),
 (1, 6, 8),
 (1, 6, 9),
 (2, 4, 7),
 (2, 4, 8),
 (2, 4, 9),
 (2, 5, 7),
 (2, 5, 8),
 (2, 5, 9),
 (2, 6, 7),
 (2, 6, 8),
 (2, 6, 9),
 (3, 4, 7),
 (3, 4, 8),
 (3, 4, 9),
 (3, 5, 7),
 (3, 5, 8),
 (3, 5, 9),
 (3, 6, 7),
 (3, 6, 8),
 (3, 6, 9)]
 
 ```

 ### itertools.combinations

 ```py
 >>> import itertools
>>> list(itertools.combinations([1, 2, 3, 4, 5], 2))
[(1, 2), (1, 3), (1, 4), (1, 5), (2, 3), (2, 4), (2, 5), (3, 4), (3, 5), (4, 5)]
```

## pour aller plus loin

* [itertools - doc python](https://docs.python.org/fr/3.9/library/itertools.html#module-itertools)
* [Iterators & Generators - anandology.com](https://anandology.com/python-practice-book/iterators.html#)
* [Les itérateurs et les générateurs python - python.doctor](https://python.doctor/page-iterateurs-iterator-generateur-generator-python)