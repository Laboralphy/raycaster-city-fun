ACTIONS



#CHAT



##chat/selectTab
Permet de selectionner un onglet.
* id {string} : identifiant de la l'onglet



#NET

##net/reqLogin
envoie une requete de login
* login {string} identifiant du login
* pass {string} mot de passe


##net/msSay
envoie un message de discussion au serveur
* channel {string} identifiant du canal sur lequel diffuser le message
* message {string} contenu du message








#UI

ui/show
-------
montrer l'interface utilisateur, si des section sont également affichée, celles ci se montrent.


ui/hide
-------
cache completement l'interface utilisateur.


ui/showSection
--------------
affichage d'une section de l'interface utilisateur
paramètres
* id {string} identifiant de la section de l'UI à afficher
    * *les identifiants possibles sont ceux renvoyés par le getter ui/getSections*



ui/hideSection
--------------
cacher une section de l'interface utilisateur
* id {string} identifiant de la section de l'UI à cacher
    * *les identifiants possibles sont ceux renvoyés par le getter ui/getSections*









