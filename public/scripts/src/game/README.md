#Classe Game Client

##Rôle
Gestion du jeu au niveau du client

## Principe
Cette classe se base sur une couche architechturale commune à tout FPS MP.
Cette couche architecturale gère la synchronisation des mobiles du jeu avec le serveur.
Elle écoute les message serveur de transimssion de données comme les niveaux.
Elle gère la cohérence en créér, supprimant, modifiant les mobiles du jeu en fonction
des ordres du serveur.

##API
###Evènements

####player.update
Survient lorsque le thinker du joueur (le composant à lécoute du clavier et de la souris) 
a une mise à jour de mouvement/commande à signaler.
La couche architecturale s'occupe de transmettre le mouvement au serveur, d'effectuer
le calcul du ping, et de corriger la position du mobile du joeur en accors avec le serveur. 

 
####enter
Survient lorsque le programme client a fini de charger un niuveau et que l'instance du
mobile joueur est créé.

####frame
####pointer.lock
####pointer.unlock

