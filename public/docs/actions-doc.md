ACTIONS



#CHAT

##chat/reset
Réinitialisation du chat. Efface les lignes et la liste des canaux.


##chat/selectTab
Permet de selectionner un onglet.
* id {string} : identifiant de la l'onglet


##chat/addTab
Ajout d'un onglet. En pratique onglet et canaux sont liés. Mais on parle d'onglet ici
parce que on est au niveau composant plutot que réseau
* id {string} : identifiant du nouvel onglet
* caption {string} : intitulé de l'onglet





#UI

##ui/show
montrer l'interface utilisateur, si des section sont également affichée, celles ci se montrent.


##ui/hide
cache completement l'interface utilisateur.


##ui/showSection
affichage d'une section de l'interface utilisateur
paramètres
* id {string} identifiant de la section de l'UI à afficher
    * *les identifiants possibles sont ceux renvoyés par le getter ui/getSections*



##ui/hideSection
cacher une section de l'interface utilisateur
* id {string} identifiant de la section de l'UI à cacher
    * *les identifiants possibles sont ceux renvoyés par le getter ui/getSections*









