#Classes GAME et SERVICE


##Rôle

Définir le comportement spécifique du jeu au delà du caractère FPS multijoueur.

###Détail du rôle

Deux FPS Multijoueurs peuvent se différentier sur de nombreux points. Ambiance, aspect graphique 
et sonore prise en main... La classes Game et Service permettent de personnaliser le comportement 
et l'aspect du jeu tandis que sa classe parente __engine/core__ est conçue pour proposer toutes 
les méthodes et outils utiles pour n'importe quel FPS-MP (positionnement des mobiles, synchronisation réseaux).

###Conception d'un jeu

Un FPS-MP se compose d'une partie serveur et une partie cliente. Les deux parties communiquent
via une couche réseaux, dans ce cas précise __socket.io__ rempli ce rôle. Dans ce document on ne parle que
de la partie serveur en détail, on ne fera qu'évoquer la partie cliente.

##### Classe Game
Cette classe est à l'écoute de divers évènement emis par le Engine/Core
##### Classe Service
Cette classe est branchée sur la couche réseau et peut écouter certain message réseau.
Le but de cette classe de Service est de proposer des fonction qui satisfont les demandes
des clients. Par exemple, un client décide de changer son équipement actif (armes, outils...),
le client envoie un message réseau dans ce contexte, et le Service a pour rôle de vérifier
si la demande est correcte et de faire les modification nécessaires puis de renvoyer dans
la plus part des cas une réponse sur l'issue de l'opération.

Cette classe est de mêche avec la partie __VuexPlugin__ qui se situe au niveau du client.
Ces deux classe formant les extrémités de la communication client serveur.

   

##API
###Méthodes
createMobile(id, ref, location)

###Evènements
