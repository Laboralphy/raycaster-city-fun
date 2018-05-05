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
le calcul du ping, et de corriger la position du mobile du joeur en accord avec le serveur.
- {t, a, x, y, sx, sy, id, c}
- __t__ : intervalle de temps entre ce packet et le précédent. 0 si c'est le premier paquet
- __a__ : angle de visée du mobile
- __x__ : position du mobile
- __y__ : position du mobile
- __sx__ : vitesse à l'axe x
- __sy__ : vitesse à l'axe y
- __c__ : code des commandes activées

 
####enter
Survient lorsque le programme client a fini de charger un niuveau et que l'instance du
mobile joueur est créé.


####frame
Survient à chaque image rendue.


####pointer.lock
Survient lorsque l'utilisateur reprend le controle du jeu, en abandonnant le controle du
pointer de la souris.


####pointer.unlock
Survient lorsque l'utilisateur reprend le controle direct de la souris 
(appui sur la Touche Echap).

