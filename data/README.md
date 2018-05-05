#DATA
## organisation des ressources JSON

Ce dossier contient les différents JSON nécessaire au jeu pour fonctionner.


###dossier : ./tiles
Ce dossier contient les JSON de définition des _tiles_.
Une _tile_ est une ressources graphique simple, une image qui peut contenir plusieurs sous-images
utilisées pour les animations de sprites. 
Par exemple : un personnage dispose de plusieurs animations :
- marcher
- attaquer
- tomber

Chaque animation contient plusieurs frames et tout ceci, multiplié par le nombre de directions
dans lesquelles est perçu le sprite, soit 8 directions.

Cela fait un grand nombre de frame, et toutes ces frame sont justaposées dans une unique image.
Il faut donc un fichier de définition de toutes ces animation.
Ce sont les fichier de définition des tiles.


### dossier : ./blueprints
Ce dossier contient les fichiers JSON de définition des blueprints.
Les blueprints sont les objet de définition des entités qu'il est possible de faire apparaitre
dans le jeu à des fins de décoration ou d'interaction avec les joueurs.

Les blueprints définissent principalement les PNJ, les plaçables, les missiles etc...


Les caractéristiques définies sont généralement :
- __tile__ : tile utilisée
- __width__ : taille physique en texel (pour les collisions)
- __height__ : hauteur physique un texel (pour les collision) , mais cette données n'est pas exploitée
- __type__ : type d'entité (plaçable, pnj, missile... voir le fichier framework/const/raycaster.js)



### dossier : ./levels
Ce dossier contient les fichiers de définition des niveaux.


### dossier : ./vault
Ce dossier contient des sous-dossier, chacun dédié à un compte personnel client.

Les sous-dossier contiennent les fichiers suivants :
- character.json : données sur le personnage (état interne)
- location.json : zone, position, direction du personnage
- password.json : mot de passe hashé

